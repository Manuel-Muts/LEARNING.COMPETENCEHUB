export function normalizeKenyanPhoneNumber(value: string): string | undefined {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("254")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return /^[17]\d{8}$/.test(digits) ? `+254${digits}` : undefined;
}

export function formatKenyanPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("254")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 9);
}
