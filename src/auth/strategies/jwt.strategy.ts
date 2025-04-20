import {
	Inject,
	Injectable,
	Request,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request as RequestType } from 'express'
import jwtConfig from '../config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'

type JwtPayload = {
	sub: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly prisma: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJwt
				// ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			secretOrKey: jwtConfiguration.secret,
			ignoreExpiration: false
		})
	}

	private static extractJwt(req: RequestType): string | null {
		// console.log(req.cookies)
		if (req.cookies?.access_token?.length) return req.cookies.access_token
		return null
	}

	async validate(payload: JwtPayload) {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true, email: true, name: true }
		})

		if (!user) {
			throw new UnauthorizedException()
		}

		return payload
	}
}
