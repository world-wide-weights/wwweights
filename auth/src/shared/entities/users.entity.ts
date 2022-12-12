import { Expose } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('email_unique', ['email'], { unique: true })
@Index('users_pkey', ['pkUserId'], { unique: true })
@Index('username_unique', ['username'], { unique: true })
@Entity('users', { schema: 'public' })
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pk_user_id' })
  pkUserId: number;

  @Expose()
  @Column('character varying', { name: 'username', unique: true, length: 24 })
  username: string;

  @Expose()
  @Column('character varying', { name: 'email', unique: true, length: 128 })
  email: string;

  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @Expose()
  @Column('character varying', {
    name: 'status',
    length: 16,
    default: () => "'user'",
  })
  status: string;

  @Expose()
  @Column('character varying', {
    name: 'role',
    length: 16,
    default: () => "'unverified'",
  })
  role: string;

  @Column('timestamp with time zone', { name: 'last_login', nullable: true })
  lastLogin: Date | null;
}
