import { IsNotEmpty, Matches, MinLength } from 'class-validator'

export class UpdatePasswordUserDto {
	@IsNotEmpty({ message: 'Current password cannot be empty' })
	currentPassword: string

	@IsNotEmpty({ message: 'New password cannot be empty' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
		message:
			'Password must contain at least one uppercase and one lowercase letter'
	})
	newPassword: string
}
