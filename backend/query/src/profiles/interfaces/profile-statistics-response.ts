import { PickType } from '@nestjs/mapped-types';
import { Profile } from '../models/profile.model';

export class ProfileStatistics extends PickType(Profile, ['count']) {
  constructor(partial: Partial<ProfileStatistics>) {
    super();
    Object.assign(this, partial);
  }
}
