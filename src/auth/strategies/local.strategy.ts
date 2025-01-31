import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly prisma: PrismaService
	) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, pwd: string): Promise<any> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email }
			})
			const isCorrectPassword = await bcrypt.compare(pwd, user.password)
			if (!isCorrectPassword) throw new UnauthorizedException()
			// if (user && (await bcrypt.compare(pwd, user.password))) {
			// 	const { password, ...result } = user
			// 	return result
			// }
			return user
		} catch (e) {
			throw new UnauthorizedException('Email or password is incorrect')
		}
	}
}
