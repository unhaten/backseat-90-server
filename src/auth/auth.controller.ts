import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() request) {
		return this.authService.login(request)
	}

	@Post('register')
	async register(@Body() request) {
		return this.authService.register(request.email, request.password)
	}
}
