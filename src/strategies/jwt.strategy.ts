import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import jwtConfig from 'src/config/jwt.config'

type JwtPayload = {
	sub: string
	email: string
	name: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtConfiguration.secret,
			ignoreExpiration: false
		})
	}

	async validate(payload: JwtPayload) {
		// console.log(
		// 	'validate from strategy calls when we want to get data with access-token'
		// )
		return payload
	}
}
