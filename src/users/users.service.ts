import { HttpStatus, Injectable } from '@nestjs/common'
import { throwHttpException } from 'src/helpers/auth.helper'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany()
	}

	async getUserProfile(req) {
		const user = await this.prisma.user.findUnique({
			where: { id: req.sub },
			select: { id: true, email: true, name: true }
		})

		if (!user) throwHttpException('User not found', HttpStatus.BAD_REQUEST)

		return user
	}
}
