import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { ConfigModule } from '@nestjs/config'
import { RefreshJwtStrategy } from 'src/auth/strategies/refresh.strategy'
import { LocalStrategy } from 'src/auth/strategies/local.strategy'
import jwtConfig from './config/jwt.config'
import refreshJwtConfig from './config/refresh-jwt.config'

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		PrismaService,
		JwtStrategy,
		RefreshJwtStrategy,
		LocalStrategy
	],
	imports: [
		PassportModule,
		JwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(jwtConfig),
		ConfigModule.forFeature(refreshJwtConfig)
	]
})
export class AuthModule {}
