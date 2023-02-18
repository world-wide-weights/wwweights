import { JWTPayload } from './jwt-payload.interface';

/**
 * @description Request with decoded jwt values attached
 */
export interface RequestWithJWTPayload {
  user: JWTPayload;
}
