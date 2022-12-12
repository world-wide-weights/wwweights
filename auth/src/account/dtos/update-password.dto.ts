import { IsString, Length } from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  @Length(8)
  password: string;
}
