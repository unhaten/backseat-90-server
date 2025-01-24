import {
	BadRequestException,
	ConflictException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { throwHttpException } from 'src/helpers/auth.helper'
import refreshJwtConfig from 'src/config/refresh-jwt.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		@Inject(refreshJwtConfig.KEY)
		private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
	) {}

	async validate(email: string, pwd: string): Promise<any> {
		// this function is called in local.strategy.ts
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

	async login(email: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true, name: true }
		})
		// if (!user)
		// 	throwHttpException(
		// 		'Email or password is incorrect',
		// 		HttpStatus.UNAUTHORIZED
		// 	)

		// const isValidPassword = await bcrypt.compare(password, user.password)

		// if (!isValidPassword)
		// 	throwHttpException(
		// 		'Email or password is incorrect',
		// 		HttpStatus.UNAUTHORIZED
		// 	)

		const payload = { sub: user.id, email: user.email, name: user.name }

		const token = await this.jwtService.signAsync(payload)
		const refreshToken = await this.jwtService.signAsync(
			payload,
			this.refreshTokenConfig
		)
		return {
			payload,
			token,
			refreshToken
		}
		// return {
		// 	access_token: await this.jwtService.signAsync(payload)
		// }
	}

	async register(email: string, pwd: string, confirmPwd: string) {
		if (pwd !== confirmPwd)
			throw new BadRequestException('Passwords doe not match')

		const isExists = await this.prisma.user.findUnique({
			where: { email }
		})

		if (isExists)
			throw new ConflictException('User with this email already exists')

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

	async refreshToken(userId: string) {
		const payload = { sub: userId }
		const token = this.jwtService.sign(payload)

		return {
			id: userId,
			token
		}
	}
}
