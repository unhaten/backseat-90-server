import { Body, Controller, Get, Post, Req, Request } from '@nestjs/common'
import { SongsService } from './songs.service'

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) {}

	@Post()
	async toggleSongs(userId: string, songId: number) {
		return this.songsService.toggleSong(userId, songId)
	}

	@Get('liked')
	async getLikedSongs(@Request() req) {
		return this.songsService.getLikedSongs(req.user)
	}

	@Get('connect')
	async connect() {
		return this.songsService.connect()
	}
}
