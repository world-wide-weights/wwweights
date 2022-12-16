import { UserEntity } from 'src/db/entities/users.entity';

export interface RequestWithRefreshPayload {
  user: UserEntity;
}
