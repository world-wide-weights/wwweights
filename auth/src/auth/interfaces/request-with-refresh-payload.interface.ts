import { UserEntity } from '../../db/entities/users.entity';

export interface RequestWithRefreshPayload extends Request {
	user: UserEntity;
}
