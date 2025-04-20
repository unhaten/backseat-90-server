import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly prisma: PrismaService) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, pwd: string): Promise<any> {
		// ! try catch only for logs, just for catch it is useless
		const user = await this.prisma.user.findUnique({
			where: { email }
		})

		if (!user) {
			throw new UnauthorizedException('email-password-incorrect')
		}
		const isCorrectPassword = await bcrypt.compare(pwd, user.password)
		if (!isCorrectPassword)
			throw new UnauthorizedException('email-password-incorrect')

		const { password: __, ...safeUser } = user
		return safeUser
	}
}
