import { IsString } from 'class-validator'

export class CreateBugReportDto {
	@IsString()
	message: string
}
