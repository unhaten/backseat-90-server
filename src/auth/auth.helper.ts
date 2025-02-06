import {
	BadRequestException,
	HttpException,
	HttpStatus,
	UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export const throwHttpException = (
	message: string,
	status: HttpStatus
): void => {
	throw new HttpException(message, status)
}

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(password, salt)

	return hashedPassword
}

export const comparePasswords = (firstPassword, secondPassword) => {
	if (firstPassword === secondPassword) {
		throw new BadRequestException(
			'Your new password is the same as current one'
		)
	}
}

export const validatePassword = async (password, passwordFromDb) => {
	const isCorrectPassword = await bcrypt.compare(password, passwordFromDb)
	if (!isCorrectPassword)
		throw new UnauthorizedException('Current password is incorrect')
}
