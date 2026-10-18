import json
import logging
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

from app.config import settings
from app.phone import normalize_kenyan_phone_number

logger = logging.getLogger(__name__)


class SmsNotConfiguredError(RuntimeError):
    pass


class SmsDeliveryError(RuntimeError):
    pass


def _send_url() -> str:
    base_url = settings.talksasa_base_url.strip().rstrip("/")
    base_url = re.sub(r"/api/v3/sms/(?:send|balance)$", "", base_url, flags=re.IGNORECASE)
    try:
        parsed = urlsplit(base_url)
        hostname = parsed.hostname
        port = parsed.port
    except ValueError as error:
        raise SmsNotConfiguredError(
            "TALKSASA_BASE_URL must be a valid HTTPS base URL."
        ) from error
    if (
        parsed.scheme != "https"
        or not hostname
        or port == 0
        or parsed.username
        or parsed.password
        or parsed.query
        or parsed.fragment
    ):
        raise SmsNotConfiguredError("TALKSASA_BASE_URL must be a valid HTTPS base URL.")
    return f"{base_url}/api/v3/sms/send"


def ensure_sms_available() -> None:
    if settings.sms_provider.lower() != "talksasa":
        raise SmsNotConfiguredError("SMS_PROVIDER is not configured for TalkSasa.")

    if not settings.talksasa_api_key:
        raise SmsNotConfiguredError("The TalkSasa API key is required.")

    _send_url()


def send_password_reset_code(phone: str, code: str) -> None:
    ensure_sms_available()
    recipient = normalize_kenyan_phone_number(phone)
    if recipient is None:
        raise ValueError("A valid Kenyan mobile number is required for SMS delivery.")

    message = (
        f"Your CompetenceHub password reset code is {code}. "
        "It expires in 10 minutes."
    )
    payload = json.dumps(
        {
            "recipient": recipient,
            "sender_id": settings.talksasa_sender_id or "TALKSASA",
            "type": "plain",
            "message": message,
            "schedule_time": None,
        }
    ).encode("utf-8")
    request = Request(
        _send_url(),
        data=payload,
        headers={
            "Authorization": f"Bearer {settings.talksasa_api_key.get_secret_value()}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=15) as response:
            result = json.loads(response.read())
    except HTTPError as error:
        logger.error("TalkSasa rejected the SMS request with HTTP status %s.", error.code)
        raise SmsDeliveryError("TalkSasa could not accept the password-reset SMS.") from error
    except (URLError, TimeoutError, OSError) as error:
        logger.error("Could not reach TalkSasa to deliver the password-reset SMS.")
        raise SmsDeliveryError("TalkSasa is temporarily unavailable.") from error
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        logger.error("TalkSasa returned an unreadable SMS response.")
        raise SmsDeliveryError("TalkSasa returned an invalid response.") from error

    if not isinstance(result, dict) or not _response_was_accepted(result):
        logger.error("TalkSasa did not confirm acceptance of the password-reset SMS.")
        raise SmsDeliveryError("TalkSasa did not accept the password-reset SMS.")


def _response_was_accepted(response: dict[str, object]) -> bool:
    accepted_statuses = {"success", "sent", "accepted", "queued", "ok", "200", "202"}
    direct_status = str(response.get("status") or response.get("message") or "").lower()
    if direct_status in accepted_statuses:
        return True

    data = response.get("data")
    recipients = response.get("recipients", [])
    if isinstance(response.get("SMSMessageData"), dict):
        recipients = response["SMSMessageData"].get("Recipients", [])
    elif isinstance(data, dict):
        recipients = data.get("recipients", recipients)
    if isinstance(recipients, list):
        for recipient in recipients:
            if isinstance(recipient, dict):
                recipient_status = str(
                    recipient.get("status")
                    or recipient.get("state")
                    or recipient.get("code")
                    or ""
                ).lower()
                if recipient_status in accepted_statuses:
                    return True

    summary = (
        data.get("summary", data.get("recipients", {}))
        if isinstance(data, dict)
        else {}
    )
    summary = summary if isinstance(summary, dict) else response.get("summary", {})
    if not isinstance(summary, dict):
        return False
    try:
        success_count = int(
            summary.get("success")
            or summary.get("sent")
            or summary.get("accepted")
            or 0
        )
    except (TypeError, ValueError):
        return False
    return success_count > 0
