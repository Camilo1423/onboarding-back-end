import { createDecipheriv, createHash } from 'crypto';

const algorithm = 'aes-256-cbc';

export function decrypt(encryptedText: string, key_env: string): string {
  const key = createHash('sha256').update(key_env).digest(); // genera 32 bytes
  const [ivHex, encryptedHex] = decodeURIComponent(encryptedText).split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
