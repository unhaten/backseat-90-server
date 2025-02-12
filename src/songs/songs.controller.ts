import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Request,
	UseGuards
} from '@nestjs/common'
import { SongsService } from './songs.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) {}

	@UseGuards(JwtAuthGuard)
	@Post('bookmarks')
	async toggleLike(userId: string, songId: number) {
		return this.songsService.toggleLike(userId, songId)
	}

	@UseGuards(JwtAuthGuard)
	@Get('bookmarks')
	async getLikedSongs(@Request() req) {
		return this.songsService.getLikedSongs(req.user.sub)
	}

	@Get('connect')
	async connect() {
		return this.songsService.connect()
	}
}
