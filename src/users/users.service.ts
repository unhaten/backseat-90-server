import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { compareNames } from './users.helper'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany()
	}

	async getUserProfile(req) {
		//* i decided not to transfer info about user in token and i give only id of user in order to secure user's data, by making this way i secure data (duh) and get every other info from DB. If i will have lack of request resources or i need more fast working app and there is nothing bad in giving email and other stuff in access token then i will need to transfer it into payload -> payload = { sub: user.id, email: user.email, name: user.email }
		const user = await this.prisma.user.findUnique({
			where: { id: req.sub },
			select: { name: true }
		})

		if (!user) throw new BadRequestException('User not found')

		return user
	}

	async getBackground(imageId: number) {
		// TODO: make a throttle!
		let randomGif = Math.floor(Math.random() * 7) + 1
		while (randomGif === +imageId) {
			randomGif = Math.floor(Math.random() * 7) + 1
		}
		const background = `backgrounds/gif-${randomGif}.webp`
		return { background: background, imageId: randomGif }
	}

	async changeName(id, name) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		// await compareNames(name, user.name)
		if (name === user.name) {
			throw new BadRequestException('same-name')
		}

		await this.prisma.user.update({
			where: { id },
			data: { name: name, updatedAt: new Date() }
		})

		return {
			name: name
		}
	}

	async sendBugReport(message: string) {
		console.log(message)
	}
}
