export function normalizeGhanaPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length >= 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}
