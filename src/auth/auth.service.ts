import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { throwHttpException } from 'src/helpers/auth.helper'

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

	async login(email: string, password: string) {
		const user = await this.prisma.user.findUnique({ where: { email } })
		if (!user)
			throwHttpException(
				'Email or password is incorrect',
				HttpStatus.UNAUTHORIZED
			)

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword)
			throwHttpException(
				'Email or password is incorrect',
				HttpStatus.UNAUTHORIZED
			)

		const payload = { email: user.email, sub: user.id, name: user.name }
		return {
			access_token: await this.jwtService.signAsync(payload)
		}
	}

	async register(email: string, pwd: string, confirmPwd: string) {
		if (pwd !== confirmPwd)
			throwHttpException('Passwords do not match', HttpStatus.BAD_REQUEST)

		const isExists = await this.prisma.user.findUnique({
			where: { email }
		})

		if (isExists)
			throwHttpException(
				'User with this email already exists',
				HttpStatus.CONFLICT
			)

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
