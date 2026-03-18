import crypto from 'crypto';

export function generateVerificationId(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}