import { HttpException, HttpStatus } from '@nestjs/common'

export function throwHttpException(message: string, status: HttpStatus) {
	throw new HttpException(message, status)
}
