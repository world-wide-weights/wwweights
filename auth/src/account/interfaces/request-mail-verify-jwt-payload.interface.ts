import { MailVerifyJWTDTO } from '../../account/dtos/mail-jwt-payload.dto';

export interface RequestWithMailJwtPayload extends Request {
  user: MailVerifyJWTDTO;
}
