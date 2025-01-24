import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import refreshJwtConfig from '../config/refresh-jwt.config'

type JwtPayload = {
	sub: string
	email: string
	name: string
}
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt'
) {
	constructor(
		@Inject(refreshJwtConfig.KEY)
		private readonly refreshJwtConfiguration: ConfigType<
			typeof refreshJwtConfig
		>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: refreshJwtConfiguration.secret,
			ignoreExpiration: false
		})
	}

	async validate(payload: JwtPayload) {
		return { sub: payload.sub }
	}
}
