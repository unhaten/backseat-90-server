import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { SongsModule } from './songs/songs.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
			serveRoot: '/public/'
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 0,
				limit: 0
			}
		]),
		UsersModule,
		PrismaModule,
		AuthModule,
		SongsModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
