import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import refreshJwtConfig from '../config/refresh-jwt.config'
import { Request } from 'express'

type JwtPayload = {
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
			jwtFromRequest: ExtractJwt.fromExtractors([
				RefreshJwtStrategy.extractRefreshJwt
				// ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			secretOrKey: refreshJwtConfiguration.secret,
			ignoreExpiration: false
		})
	}

	private static extractRefreshJwt(req: Request): string | null {
		if (req.cookies?.refresh_token?.length) return req.cookies.refresh_token
		return null
	}

	async validate(payload: JwtPayload) {
		// validate from strategy calls when we want to get data with refresh-token and returns payload (id only)
		return payload
	}
}
