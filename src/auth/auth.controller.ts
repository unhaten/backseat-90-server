import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { LoginUserDto } from 'src/users/dto/login-user-dto'
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto.email, loginUserDto.password)
	}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return this.authService.register(
			createUserDto.email,
			createUserDto.password,
			createUserDto.confirmPassword
		)
	}
}
