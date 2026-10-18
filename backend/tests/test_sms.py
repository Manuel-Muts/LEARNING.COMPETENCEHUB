import json
import unittest
from unittest.mock import MagicMock, patch

from pydantic import SecretStr

from app import sms
from app.sms import SmsDeliveryError, SmsNotConfiguredError, send_password_reset_code


class TalkSasaSmsTests(unittest.TestCase):
    def configured_settings(self) -> None:
        patches = (
            patch.object(sms.settings, "sms_provider", "talksasa"),
            patch.object(sms.settings, "talksasa_api_key", SecretStr("test-api-key")),
            patch.object(sms.settings, "talksasa_sender_id", "TESTSENDER"),
            patch.object(
                sms.settings,
                "talksasa_base_url",
                "https://bulksms.talksasa.com/api/v3/sms/balance/",
            ),
        )
        for patcher in patches:
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_sends_reset_code_using_talksasa_api_contract(self) -> None:
        self.configured_settings()
        response = MagicMock()
        response.__enter__.return_value.read.return_value = b'{"status":"success"}'
        with patch("app.sms.urlopen", return_value=response) as mocked_urlopen:
            send_password_reset_code("0712 345 678", "012345")

        request = mocked_urlopen.call_args.args[0]
        self.assertEqual(
            request.full_url,
            "https://bulksms.talksasa.com/api/v3/sms/send",
        )
        self.assertEqual(request.get_header("Authorization"), "Bearer test-api-key")
        payload = json.loads(request.data)
        self.assertEqual(payload["recipient"], "+254712345678")
        self.assertEqual(payload["sender_id"], "TESTSENDER")
        self.assertEqual(payload["type"], "plain")
        self.assertIn("012345", payload["message"])
        self.assertIsNone(payload["schedule_time"])

    def test_rejects_unconfigured_provider(self) -> None:
        with (
            patch.object(sms.settings, "sms_provider", "disabled"),
            self.assertRaises(SmsNotConfiguredError),
        ):
            send_password_reset_code("0712345678", "012345")

    def test_rejects_insecure_base_url(self) -> None:
        with (
            patch.object(sms.settings, "sms_provider", "talksasa"),
            patch.object(sms.settings, "talksasa_api_key", SecretStr("test-api-key")),
            patch.object(sms.settings, "talksasa_base_url", "http://example.test"),
            self.assertRaises(SmsNotConfiguredError),
        ):
            send_password_reset_code("0712345678", "012345")

    def test_rejects_unconfirmed_provider_response(self) -> None:
        self.configured_settings()
        response = MagicMock()
        response.__enter__.return_value.read.return_value = b'{"status":"failed"}'
        with (
            patch("app.sms.urlopen", return_value=response),
            self.assertLogs("app.sms", level="ERROR"),
            self.assertRaises(SmsDeliveryError),
        ):
            send_password_reset_code("0712345678", "012345")

    def test_reports_provider_http_failure(self) -> None:
        self.configured_settings()
        from urllib.error import HTTPError

        with (
            patch(
                "app.sms.urlopen",
                side_effect=HTTPError(
                    "https://bulksms.talksasa.com/api/v3/sms/send",
                    401,
                    "Unauthorized",
                    {},
                    None,
                ),
            ),
            self.assertLogs("app.sms", level="ERROR"),
            self.assertRaises(SmsDeliveryError),
        ):
            send_password_reset_code("0712345678", "012345")

    def test_requires_a_valid_kenyan_mobile_number(self) -> None:
        self.configured_settings()
        with self.assertRaises(ValueError):
            send_password_reset_code("not-a-phone", "012345")


if __name__ == "__main__":
    unittest.main()
