import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
	constructor(
		// private readonly usersService: UsersService,
		private readonly usersService: UsersService
	) {}

	@Get()
	async findAll() {
		return await this.usersService.findAll()
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req) {
		return await this.usersService.getUserProfile(req.user)
	}
}
