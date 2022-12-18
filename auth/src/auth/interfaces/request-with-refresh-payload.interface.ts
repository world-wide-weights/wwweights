import { UserEntity } from '../../db/entities/users.entity';

export interface RequestWithRefreshPayload {
  user: UserEntity;
}
