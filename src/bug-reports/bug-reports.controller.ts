import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
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

	@UseGuards(JwtAuthGuard)
	@Get()
	async getBugReportsAmount(@Request() req) {
		return await this.bugReportsService.getBugReportsAmount(req.user.sub)
	}

	@UseGuards(JwtAuthGuard)
	@Delete()
	async delete(id: string) {
		return await this.bugReportsService.delete(id)
	}
}
