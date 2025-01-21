import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService
	) {}

	async validate(email: string, pwd: string): Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: { email }
		})

		if (user && (await bcrypt.compare(pwd, user.password))) {
			const { password, ...result } = user
			return result
		}
		return null
	}

	async login(user: any) {
		const payload = { email: user.email, sub: user.id }
		return {
			access_token: this.jwtService.sign(payload)
		}
	}

	async register(email: string, pwd: string) {
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(pwd, salt)

		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		})

		const { password, ...result } = user
		return result
	}
}
