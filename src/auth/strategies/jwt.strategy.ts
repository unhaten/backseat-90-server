import { Inject, Injectable, Request } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request as RequestType } from 'express'
import jwtConfig from '../config/jwt.config'

type JwtPayload = {
	sub: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJwt,
				ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			secretOrKey: jwtConfiguration.secret,
			ignoreExpiration: false
		})
	}

	private static extractJwt(req: RequestType): string | null {
		if (
			req.cookies &&
			'access_token' in req.cookies &&
			req.cookies.access_token.length > 0
		) {
			return req.cookies.access_token
		}
		return null
	}

	async validate(payload: JwtPayload) {
		// validate from strategy calls when we want to get data with access-token and returns payload (id only)
		return payload
	}
}
