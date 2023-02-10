import { ROLES } from '../enums/roles.enum';
import { STATUS } from '../enums/status.enum';

/**
 * @description DTO for JWT Token content
 */
export class JWTPayload {
  username: string;
  id: number;
  email: string;
  status: STATUS;
  role: ROLES;
}
