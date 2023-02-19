import { PickType } from '@nestjs/mapped-types';
import { Profile } from '../../models/profile.model';

/**
 * @description The ProfileStatistics class is used to return the statistics for a profile
 * @extends {PickType(Profile, ['count'])}
 */
export class ProfileStatistics extends PickType(Profile, ['count']) {
  constructor(partial: Partial<ProfileStatistics>) {
    super();
    Object.assign(this, partial);
  }
}
