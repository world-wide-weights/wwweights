import * as bcrypt from 'bcrypt';

export function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
