import { IsOptional, IsString } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends CreateUserDto {
	@IsString()
	@IsOptional()
	name?: string
}
