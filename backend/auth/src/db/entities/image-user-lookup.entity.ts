import { Column, Entity } from 'typeorm';

@Entity('users', { schema: 'public' })
export class ImageUserLookupEntity {
  @Column({ type: 'integer', name: 'fk_user_id' })
  fkUserId: number;

  @Column({ type: 'text', name: 'image_hash' })
  imageHash: string;
}
