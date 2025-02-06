import { IsNotEmpty, MaxLength } from 'class-validator'

export class UpdateNameDto {
	@IsNotEmpty({ message: 'Name should not be empty' })
	@MaxLength(20, { message: 'Your name cannot be longer than 20 characters' })
	name: string
}
