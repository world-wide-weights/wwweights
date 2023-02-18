import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ROLES } from '../../shared/enums/roles.enum';
import { STATUS } from '../../shared/enums/status.enum';

/**
 * @description Entity with all user information
 */
@Index('email_unique', ['email'], { unique: true })
@Index('users_pkey', ['pkUserId'], { unique: true })
@Index('username_unique', ['username'], { unique: true })
@Entity('users', { schema: 'public' })
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pk_user_id' })
  @ApiProperty({ description: 'User ID', example: 1 })
  pkUserId: number;

  @Expose()
  @Column('character varying', { name: 'username', unique: true, length: 24 })
  @ApiProperty({
    description: 'Public username of user',
    example: 'CoffeeLover',
  })
  username: string;

  @Expose({ groups: ['self'] })
  @Column('character varying', { name: 'email', unique: true, length: 128 })
  @ApiPropertyOptional({
    description: 'Email of the user. Only exposed to self',
    example: 'test@test.test',
  })
  email: string;

  @Exclude()
  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @Expose()
  @Column('character varying', {
    name: 'status',
    length: 16,
    default: () => "'user'",
  })
  @ApiProperty({
    description: 'Status of the user',
    enum: STATUS,
    example: STATUS.VERIFIED,
  })
  status: string;

  @Expose()
  @Column('character varying', {
    name: 'role',
    length: 16,
    default: () => "'unverified'",
  })
  @ApiProperty({ description: 'User role', enum: ROLES, example: ROLES.USER })
  role: string;

  @Expose({ groups: ['self'] })
  @Column('timestamp with time zone', { name: 'last_login', nullable: true })
  @ApiPropertyOptional({
    description: 'Last login for the user. Only exposed to self',
    example: Date.now(),
  })
  lastLogin: Date | null;

  @Expose()
  @Column({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  @ApiPropertyOptional({
    description: 'Creation date of user',
    example: Date.now(),
  })
  createdAt: Date;
}
