import { UserEntity } from '../../db/entities/users.entity';

/**
 * @description Interface for request with user attached
 */
export interface RequestWithDbUser extends Request {
  /**
   * @description Attached user entity
   */
  user: UserEntity;
}
