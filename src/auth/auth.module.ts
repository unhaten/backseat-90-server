import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/strategies/jwt.strategy'
import jwtConfig from 'src/config/jwt.config'
import { ConfigModule } from '@nestjs/config'
import refreshJwtConfig from 'src/config/refresh-jwt.config'
import { RefreshJwtStrategy } from 'src/strategies/refresh.strategy'
import { LocalStrategy } from 'src/strategies/local.strategy'

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
