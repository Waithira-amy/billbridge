import { isValidPhoneNumber } from "libphonenumber-js/min";

const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const namePattern = /^[\p{L}\p{M}]+(?: +[\p{L}\p{M}]+)*$/u;

export function isValidDonorName(name: string) {
  const normalized = name.trim();
  return normalized.length <= 100 && (!normalized || namePattern.test(normalized));
}

export function isValidDonorEmail(email: string) {
  const normalized = email.trim();
  if (!normalized) return true;
  const localPart = normalized.split("@")[0];
  return normalized.length <= 254 && !localPart.startsWith(".") && !localPart.endsWith(".") && !localPart.includes("..") && emailPattern.test(normalized);
}

export function isValidDonorPhone(phone: string) {
  return isValidPhoneNumber(phone);
}