import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Request,
	UseGuards
} from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UpdateNameDto } from './dto/update-name-user.dto'
import { Throttle } from '@nestjs/throttler'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req) {
		return await this.usersService.getUserProfile(req.user)
	}

	@UseGuards(JwtAuthGuard)
	@Post('change-name')
	async changeName(@Request() request, @Body() dto: UpdateNameDto) {
		return await this.usersService.changeName(request.user.sub, dto.name)
	}

	@Get('background')
	async getBackground(@Query('image-id') imageId: number) {
		return await this.usersService.getBackground(imageId)
	}

	@Throttle({ default: { limit: 3, ttl: 1 * 3 * 1000 } })
	@UseGuards(JwtAuthGuard)
	@Get('check')
	async checkUser() {
		return { message: 'User is logged in' }
	}
}
