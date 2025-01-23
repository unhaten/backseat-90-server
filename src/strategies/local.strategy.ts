import { HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/auth/auth.service'
import { throwHttpException } from 'src/helpers/auth.helper'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.authService.validate(email, password)
		if (!user)
			throwHttpException(
				'Email or password is incorrect',
				HttpStatus.UNAUTHORIZED
			)
		return user
	}
}
