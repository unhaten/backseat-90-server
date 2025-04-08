import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class BugReportsService {
	constructor(private readonly prisma: PrismaClient) {}

	async create(message, id) {}
}
