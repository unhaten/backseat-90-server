import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { LoginUserDto } from 'src/users/dto/login-user-dto'
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'
import { JwtService } from '@nestjs/jwt'
import { RefreshJwtAuthGuard } from 'src/guards/refresh-auth.guard'
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService
	) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: LoginUserDto) {
		return this.authService.login(dto.email, dto.password)
	}

	@Post('register')
	async register(@Body() dto: CreateUserDto) {
		return this.authService.register(
			dto.email,
			dto.password,
			dto.confirmPassword
		)
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Post('refresh')
	async refreshToken(@Request() req) {
		return this.authService.refreshToken(req.user.sub)
	}
}
