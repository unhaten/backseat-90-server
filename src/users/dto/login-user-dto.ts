import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
	@IsEmail({}, { message: 'Invalid email format' })
	email: string

	@IsNotEmpty({ message: 'Password cannot be empty' })
	password: string
}
