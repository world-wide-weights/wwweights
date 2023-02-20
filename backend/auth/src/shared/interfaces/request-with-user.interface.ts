import { JWTPayload } from './jwt-payload.interface';

/**
 * @description Request with decoded JWT payload attached
 */
export interface RequestWithJWTPayload extends Request {
  user: JWTPayload;
}
