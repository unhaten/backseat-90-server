import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsEmail({}, { message: 'Invalid email format' })
	email: string

	@IsNotEmpty({ message: 'Password cannot be empty' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string

	@IsNotEmpty({ message: 'Confirmation password cannot be empty' })
	confirmPassword?: string
}
