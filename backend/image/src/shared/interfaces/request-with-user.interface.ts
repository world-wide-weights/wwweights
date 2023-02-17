import { JWTPayload } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JWTPayload;
}
