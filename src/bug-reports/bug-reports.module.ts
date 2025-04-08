import { Module } from '@nestjs/common'
import { BugReportsService } from './bug-reports.service'
import { BugReportsController } from './bug-reports.controller'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
	controllers: [BugReportsController],
	providers: [BugReportsService, PrismaService]
})
export class BugReportsModule {}
