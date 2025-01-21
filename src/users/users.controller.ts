import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('users')
export class UsersController {
	constructor(
		// private readonly usersService: UsersService,
		private readonly prismaService: PrismaService
	) {}

	@Get()
	async findAll() {
		return await this.prismaService.user.findMany()
	}

	// @Get()
	// findOne() {
	// 	return 'finds specific user'
	// }
}
