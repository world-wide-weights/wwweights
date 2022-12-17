import { ResetJWTPayload } from '../dtos/reset-jwt-payload.dto';

export interface RequestWithResetJWTPayload extends Request {
  user: ResetJWTPayload;
}
