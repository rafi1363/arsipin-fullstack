export function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidDateInput(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  const parsedDate = new Date(trimmedValue);

  return !Number.isNaN(parsedDate.getTime());
}

export function toDate(value: string) {
  return new Date(value.trim());
}
