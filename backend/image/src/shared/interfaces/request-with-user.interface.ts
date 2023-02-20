import { JWTPayload } from './jwt-payload.interface';

/**
 * @description Request along with the decoded contents of the JWT
 */
export interface RequestWithJWTPayload extends Request {
  user: JWTPayload;
}
