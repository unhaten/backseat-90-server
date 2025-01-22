import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/strategies/jwt.strategy'

@Module({
	controllers: [AuthController],
	providers: [AuthService, PrismaService, JwtStrategy],
	imports: [
		PassportModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '7d' }
		})
	]
})
export class AuthModule {}
