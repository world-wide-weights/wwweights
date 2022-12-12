import { Injectable } from '@nestjs/common'
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { JWTPayload } from '../dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(private readonly configService: ConfigService ){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET')
		})
	}

	async validate(payload: JWTPayload){
		return payload
	}
	
}
