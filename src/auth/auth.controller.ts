import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	Res,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { LoginUserDto } from 'src/users/dto/login-user-dto'
import { RefreshJwtAuthGuard } from 'src/auth/guards/refresh-auth.guard'
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UpdatePasswordUserDto } from 'src/users/dto/update-password-user.dto'
import { request } from 'http'
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() request, @Res({ passthrough: true }) response) {
		console.log(request.user)
		return this.authService.login(request.user, response)
	}

	@HttpCode(HttpStatus.OK)
	@Post('register')
	async register(@Body() dto: CreateUserDto) {
		return this.authService.register(
			dto.email,
			dto.password,
			dto.confirmPassword
		)
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(RefreshJwtAuthGuard)
	@Post('refresh')
	async refreshToken(@Request() req, @Res({ passthrough: true }) response) {
		return this.authService.refreshToken(req.user.sub, response)
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Post('change-password')
	async changePassword(
		@Request() request,
		@Body() dto: UpdatePasswordUserDto
	) {
		return this.authService.changePassword(
			request.user.sub,
			dto.currentPassword,
			dto.newPassword
		)
	}

	@Get('logout')
	async logout(@Res({ passthrough: true }) response) {
		return this.authService.logout(response)
	}
}
