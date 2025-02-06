import { BadRequestException } from '@nestjs/common'

export const compareNames = (newName, nameFromDb) => {
	if (newName === nameFromDb) {
		throw new BadRequestException(
			'Your new name is the same as current one'
		)
	}
}
