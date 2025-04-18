import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BugReportsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(message: string, userId: string) {
		const bugReportsAmount = await this.prisma.bugReport.count({
			where: { userId }
		})

		if (bugReportsAmount >= 5)
			throw new BadRequestException('bug-report-limit-reached')

		return await this.prisma.bugReport.create({
			data: {
				message,
				userId
			}
		})
	}

	async getBugReportsAmount(userId: string) {
		const amount = await this.prisma.bugReport.count({
			where: { userId }
		})

		return 5 - amount
	}

	async delete(id: string) {
		return await this.prisma.bugReport.delete({
			where: { id }
		})
	}

	async getBugReportsList() {
		return await this.prisma.bugReport.findMany()
	}
}
