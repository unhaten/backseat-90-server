import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
import { BugReportsService } from './bug-reports.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateBugReportDto } from './dto/create-bug-report.dto'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Role } from 'src/auth/enum/role.enum'
import { Roles } from 'src/auth/decorators/roles.decorator'

@Controller('bug-reports')
export class BugReportsController {
	constructor(private readonly bugReportsService: BugReportsService) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Request() req, @Body() dto: CreateBugReportDto) {
		return await this.bugReportsService.create(dto.message, req.user.sub)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getBugReportsAmountLeft(@Request() req) {
		return await this.bugReportsService.getBugReportsAmountLeft(
			req.user.sub
		)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@Get()
	async getBugReportsList() {
		return await this.bugReportsService.getBugReportsList()
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@Delete()
	async delete(id: string) {
		return await this.bugReportsService.delete(id)
	}
}
