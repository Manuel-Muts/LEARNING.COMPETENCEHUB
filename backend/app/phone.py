import re


def normalize_kenyan_phone_number(value: str) -> str | None:
    digits = re.sub(r"\D", "", value)
    if digits.startswith("254"):
        digits = digits[3:]
    if digits.startswith("0"):
        digits = digits[1:]
    if re.fullmatch(r"[17]\d{8}", digits):
        return f"+254{digits}"
    return None
