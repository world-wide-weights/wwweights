import { JWTPayload } from '../dtos/jwt-payload.dto';

export interface RequestWithUser extends Request {
  user: JWTPayload;
}
