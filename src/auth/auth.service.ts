import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfigType } from '@nestjs/config'
import refreshJwtConfig from './config/refresh-jwt.config'
import { comparePasswords, hashPassword, validatePassword } from './auth.helper'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		@Inject(refreshJwtConfig.KEY)
		private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
	) {}

	async login(
		user: { id: string; name: string; email: string },
		response: Response
	) {
		const payload = { sub: user.id }

		const token = await this.jwtService.signAsync(payload)
		const refreshToken = await this.jwtService.signAsync(
			payload,
			this.refreshTokenConfig
		)
		response.cookie('access_token', token, {
			// set to 30 minutes
			expires: new Date(Date.now() + 30 * 60 * 1000),
			httpOnly: true
			// secure: process.env.NODE_ENV === 'production' ? true : false,
			// sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
			// domain: '.app.localhost',
			// path: '/'
		})
		response.cookie('refresh_token', refreshToken, {
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			httpOnly: true
		})
		return { name: user.name }
		// return {
		// 	token,
		// 	refreshToken
		// }
	}

	async register(email: string, pwd: string, confirmPwd: string) {
		if (pwd !== confirmPwd)
			throw new BadRequestException('passwords-do-not-match')

		const isExists = await this.prisma.user.findUnique({
			where: { email }
		})

		if (isExists) throw new ConflictException('email-exists')

		// const hashedPassword = await hashPassword(pwd)
		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(pwd, salt)

		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		})

		const { password: __, ...result } = user
		// TODO: give a token
		return result
	}

	async refreshToken(userId: string, response: Response) {
		const payload = { sub: userId }
		const newToken = await this.jwtService.signAsync(payload)

		response.cookie('access_token', newToken, {
			expires: new Date(Date.now() + 30 * 60 * 1000),
			httpOnly: true
		})

		return {}

		// return {
		// 	// id: userId,
		// 	newToken
		// }
	}

	async changePassword(
		id: string,
		currentPassword: string,
		newPassword: string
	) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		// validatePassword(currentPassword, user.password)
		const isCorrectPassword = await bcrypt.compare(
			currentPassword,
			user.password
		)
		if (!isCorrectPassword)
			throw new UnauthorizedException('current-password-incorrect')

		// comparePasswords(currentPassword, newPassword)
		if (currentPassword === newPassword) {
			throw new BadRequestException('same-password')
		}

		// const newHashedPassword = await hashPassword(newPassword)
		const salt = await bcrypt.genSalt()
		const newHashedPassword = await bcrypt.hash(newPassword, salt)

		await this.prisma.user.update({
			where: { id },
			data: { password: newHashedPassword, updatedAt: new Date() }
		})

		// return { message: 'You have changed your password successfully!' }
		return {}
	}

	async logout(response: Response) {
		response.cookie('access_token', '', { expires: new Date(Date.now()) })
		response.cookie('refresh_token', '', { expires: new Date(Date.now()) })
		return {}
	}
}
