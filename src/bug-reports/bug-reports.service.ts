import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BugReportsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(message: string, userId: string) {
		const bugReportAmount = await this.prisma.bugReport.count({
			where: { userId }
		})

		if (bugReportAmount >= 5)
			throw new BadRequestException('bug-report-limit-reached')

		return await this.prisma.bugReport.create({
			data: {
				message,
				userId
			}
		})
	}

	async delete(id: string) {}
}
