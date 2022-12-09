import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from '../entities/users.entity'


@Injectable()
export class UserService{
	
	constructor(@InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>){}

	async findOneByEmail(email: string){
		return await this.userEntity.findOneBy({email: email})
	}

	async findOneByUserName(username: string){
		return await this.userEntity.findOneBy({username: username})
	}

	async findOneById(id){
		return await this.userEntity.findOneById(id)
	}

	async setLoginTimestamp(id: number){
		// TODO: maybe add new way to fetch time other than OS time

		// Use postgres function to get the current timestamp. This allows for consistent time measurements even with multiple auth services running
		await this.userEntity.update(id , {lastLogin: "NOW()::timestamptz"}) 
	}

	async insertNew(userData: Partial<UserEntity>): Promise<UserEntity>{
		try{
			const user = this.userEntity.create(userData)
			await this.userEntity.save(user)
			return user 
		} catch(e){
			// TODO: Add catch for conflicts
			throw e
		}
	}
}
