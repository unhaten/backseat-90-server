import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ServeStaticModule.forRoot({
             rootPath: join(__dirname, '..', 'public'),
             serveRoot: '/public/'
         }),
		UsersModule,
		PrismaModule,
		AuthModule,
		SongsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
