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
  if (email.includes(" ")) {
    return false;
  }

  const atIndex = email.indexOf("@");

  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (!localPart || !domainPart) {
    return false;
  }

  if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
    return false;
  }

  if (!domainPart.includes(".")) {
    return false;
  }

  if (domainPart.includes("..")) {
    return false;
  }

  return true;
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
