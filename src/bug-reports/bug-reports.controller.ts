import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { BugReportsService } from './bug-reports.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateBugReportDto } from './dto/create-bug-report.dto'

@Controller('bug-reports')
export class BugReportsController {
	constructor(private readonly bugReportsService: BugReportsService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Request() req, @Body() dto: CreateBugReportDto) {
		return await this.bugReportsService.create(dto.message, req.user.sub)
	}
}
