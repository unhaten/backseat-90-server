import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BugReportsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(message, id) {}
}
