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
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@Body() dto: LoginUserDto,
		@Res({ passthrough: true }) response
	) {
		return this.authService.login(dto.email, response)
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

	@Get('logout')
	async logout(@Res({ passthrough: true }) response) {
		return this.authService.logout(response)
	}
}
