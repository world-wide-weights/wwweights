import { ApiProperty } from "@nestjs/swagger";

export class ImageUploadConflictError {
    @ApiProperty({description: 'Message containing conflict reason'})
    message: string

    @ApiProperty({description: 'Path of the image to be fetched from serve endpoint', example: 'abcdefg.png'})
    path: string
}