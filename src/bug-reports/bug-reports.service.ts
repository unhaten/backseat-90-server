import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BugReportsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(message: string, userId: string) {
		const bugReportAmount = await this.prisma.bugReport.count({
			where: { userId }
		})

		if (bugReportAmount >= 5) throw new Error('bug-report-limit-reached')

		return this.prisma.bugReport.create({
			data: {
				message,
				userId
			}
		})
	}

	async delete(id: string) {}
}
