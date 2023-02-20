import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

/**
 * @description Dto for demoting an image
 */
export class PromoteImageDTO {
  @IsString()
  @ApiProperty({description: 'Imagehash with file ending for the image in question', example: 'kjhslhdjfghasdjhfgsgfaljfghdafjkdfkgdasgfashjf.png'})
  imageHash: string;
}
