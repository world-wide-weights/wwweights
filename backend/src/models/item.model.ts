import { AggregateRoot } from '@nestjs/cqrs';
import { Expose, Transform } from 'class-transformer';
import slugify from 'slugify';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export class Weight {
  @Expose()
  @Column()
  // This is always in grams and scientific notation example: 1.234e10
  value: string;

  @Expose()
  @Column()
  isCa: boolean;

  @Expose()
  @Column({ nullable: true })
  additional_range_value: string;
}

@Entity()
export class Item extends AggregateRoot {
  @ObjectIdColumn()
  @Expose({ name: 'id' })
  _id: ObjectID;

  @Expose()
  @Column({ unique: true })
  name: string;

  @Expose()
  @Transform((params) => {
    return slugify(params.obj.name, {
      strict: true,
      lower: true,
      trim: true,
    });
  })
  @Column({ unique: true })
  slug: string;

  @Expose()
  @Column(() => Weight)
  weight: Weight;

  // TODO: Temporary solution, needs to be @ManyToMany
  @Expose()
  @Column('text', { array: true })
  //@ManyToMany(() => Tag, (tag) => tag.items) No Tags yet
  tags: string[];

  @Expose()
  @Column()
  image: string; // Link to static store or base-64 Encoded?

  // TODO: Temporary solution
  @Expose()
  @Column({
    nullable: true,
    default: 'no source available',
  })
  source: string;

  // TODO: Temporary solution needs to be @ManyToOne
  @Expose()
  @Column()
  user: string;

  constructor(partial: Partial<Item>) {
    super();
    Object.assign(this, partial);
  }
}
