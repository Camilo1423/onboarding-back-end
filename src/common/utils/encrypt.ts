import { createCipheriv, createHash, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES usa IV de 16 bytes

export function encrypt(text: string, key_env: string): string {
  const key = createHash('sha256').update(key_env).digest(); // genera 32 bytes
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  return encodeURIComponent(
    iv.toString('hex') + ':' + encrypted.toString('hex'),
  );
}
