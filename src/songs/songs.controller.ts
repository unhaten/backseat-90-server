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
import { Throttle } from '@nestjs/throttler'

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) {}

	@Throttle({ default: { limit: 1, ttl: 1 * 1 * 500 } })
	@UseGuards(JwtAuthGuard)
	@Post('bookmarks')
	async toggleLike(@Request() req, @Body() dto) {
		// console.log(req.user.sub, dto.id)
		return this.songsService.toggleLike(req.user.sub, dto.id)
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

	@UseGuards(JwtAuthGuard)
	@Post('is-liked')
	async isSongLiked(@Request() req, @Body() dto) {
		return this.songsService.isSongLiked(req.user.sub, dto.id)
	}
}
