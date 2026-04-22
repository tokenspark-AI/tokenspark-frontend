import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT = Buffer.from(process.env.ENCRYPTION_SALT || 'tokenspark-default-salt-2026', 'utf-8');
const ENCRYPTION_KEY = scryptSync(
  process.env.ENCRYPTION_SECRET || 'tokenspark-master-key',
  SALT,
  KEY_LENGTH
);

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag().toString('base64');

  return `${iv.toString('base64')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivBase64, authTagBase64, encrypted] = encryptedText.split(':');

  if (!ivBase64 || !authTagBase64 || !encrypted) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function generateApiKey(): { key: string; prefix: string } {
  const random = randomBytes(24).toString('hex');
  const prefix = random.slice(0, 8);
  return {
    key: `tsk_live_${random}`,
    prefix: `tsk_live_${prefix}`,
  };
}

export function hashApiKey(key: string): string {
  const { createHash } = require('crypto');
  return createHash('sha256').update(key).digest('hex');
}
