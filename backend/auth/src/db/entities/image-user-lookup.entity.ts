import { Entity, PrimaryColumn } from 'typeorm';

/**
 * @description Entity holding persistant connections between user and image
 */
@Entity('user_image_lookup', { schema: 'public' })
export class ImageUserLookupEntity {
  @PrimaryColumn({ type: 'integer', name: 'fk_user_id' })
  fkUserId: number;

  @PrimaryColumn({ type: 'text', name: 'image_hash' })
  imageHash: string;
}
