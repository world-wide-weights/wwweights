import * as bcrypt from 'bcrypt';

/**
 * @description Compare plain password to hash
 */
export function comparePassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}
