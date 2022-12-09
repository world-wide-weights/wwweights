import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserEntity} from '../shared/entities/users.entity';
import {UserService} from '../shared/services/user.service';
import {LoginDTO} from './dtos/login.dto';
import {SignUpDTO} from './dtos/signup.dto';

@Injectable()
export class AuthService {
	
	constructor(private readonly userService: UserService, private readonly jwtService: JwtService){}

	async signup(body: SignUpDTO){
		const newUser = this.userService.insertNew(body)
		if (!newUser){
			throw new InternalServerErrorException()
		}
		return newUser
	}

	async login(body: LoginDTO){
		const user = await this.userService.findOneByEmail(body.email)
		if (!user || user.password !== body.password){
			throw new UnauthorizedException()
		}

		// This is not awaited, as it is not necessary for the user
		this.userService.setLoginTimestamp(user.pkUserId)
		return this.generateJWTToken(user) 
	}

	generateJWTToken(user: UserEntity){
		const payload = { username: user.username, sub: user.pkUserId, email: user.email };
    	return {
      		access_token: this.jwtService.sign(payload),
    	};
	}
}
