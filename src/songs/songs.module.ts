import { Module } from '@nestjs/common'
import { SongsService } from './songs.service'
import { SongsController } from './songs.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { HttpModule } from '@nestjs/axios'

@Module({
	imports: [HttpModule],
	controllers: [SongsController],
	providers: [SongsService, PrismaService]
})
export class SongsModule {}
