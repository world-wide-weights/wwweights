import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AuthStatisticsResponse {
    @Expose()
    @ApiProperty({description: 'Amount of registered users', type: Number})
    totalUsers: number

    constructor(data: Partial<AuthStatisticsResponse>){
        Object.assign(this,data)
    }

}