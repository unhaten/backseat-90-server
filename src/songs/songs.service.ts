import { HttpService } from '@nestjs/axios'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SongsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly httpService: HttpService
	) {}
	async connect() {
		try {
			const response = await lastValueFrom(
				this.httpService.get(process.env.STATION_URL)
			)

			const currentSong = response.data
			if (
				!currentSong?.station?.listen_url ||
				!currentSong?.now_playing?.song
			) {
				throw new BadRequestException('Invalid station data received')
			}

			return {
				url: currentSong.station.listen_url,
				currentListeners: currentSong.listeners.current ?? 0,
				song: {
					id: currentSong.now_playing.song.id ?? 'unknown',
					playedAt: currentSong.now_playing.played_at ?? 0,
					duration: currentSong.now_playing.duration ?? 0,
					elapsed: currentSong.now_playing.elapsed ?? 0,
					thumbnail: currentSong.now_playing.song.art ?? '',
					title: currentSong.now_playing.song.title || 'Unknown',
					author: currentSong.now_playing.song.artist || 'Unknown'
				}
			}
		} catch (error) {
			// console.error('Error fetching station data:', error)

			//* Check if the error is an Axios error (HTTP request failure)
			if (error.response) {
				throw new BadRequestException(
					`Failed to connect to station: ${error.response.statusText}`
				)
			}

			throw new BadRequestException('Failed to connect to the station')
		}
	}

	async isSongLiked(userId: string, songId: string) {
		const likedSong = await this.prisma.likedSong.findUnique({
			where: {
				userId_songId: {
					userId: userId,
					songId: songId
				}
			}
		})
		return likedSong !== null
	}

	async getBookmarks(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				likedSongs: {
					select: {
						song: {
							select: {
								id: true,
								title: true,
								author: true,
								thumbnail: true,
								likes: true
							}
						}
					}
				}
			}
		})

		if (!user) throw new NotFoundException('User not found')

		const azuraData = await lastValueFrom(
			this.httpService.get(process.env.STATION_URL)
		).then(res => res.data)

		const history = azuraData.song_history || []

		return user.likedSongs.map(liked => {
			let song = liked.song
			const azuraSong = history.find(s => s.song.id === song.id)

			return {
				id: song.id,
				likes: song.likes,
				title: song.title || azuraSong?.song.title || 'Unknown',
				author: song.author || azuraSong?.song.artist || 'Unknown',
				thumbnail: song.thumbnail || azuraSong?.song.art || null
			}
		})

		// //* Extract and return the relevant details from each liked song
		// return user?.likedSongs?.map(likedSong => likedSong.song) || []
	}

	async toggleLike(userId: string, songId: string) {
		let song = await this.prisma.song.findUnique({
			where: { id: songId }
		})

		if (!song) {
			const azuraResponse = await lastValueFrom(
				this.httpService.get(process.env.STATION_URL)
			)

			const songMetadata = azuraResponse.data.now_playing.song

			if (songMetadata.id !== songId) {
				throw new BadRequestException('Song metadata mismatch')
			}

			song = await this.prisma.song.create({
				data: {
					id: songMetadata.id,
					title: songMetadata.title || 'Unknown',
					author: songMetadata.artist || 'Unknown',
					thumbnail: songMetadata.art || null,
					likes: 0
				}
			})
		}

		const isLiked = await this.prisma.likedSong.findUnique({
			where: {
				userId_songId: {
					userId: userId,
					songId: songId
				}
			}
		})

		if (!isLiked) {
			await this.prisma.$transaction([
				this.prisma.likedSong.create({
					data: {
						userId: userId,
						songId: songId
					}
				}),
				this.prisma.song.update({
					where: { id: songId },
					data: { likes: { increment: 1 } }
				})
			])
			// console.log('liked')
		} else {
			await this.prisma.$transaction([
				this.prisma.likedSong.delete({
					where: {
						userId_songId: {
							userId: userId,
							songId: songId
						}
					}
				}),
				this.prisma.song.update({
					where: { id: songId },
					data: { likes: { decrement: 1 } }
				})
			])
			// console.log('disliked')
		}

		return !isLiked
	}

	async deleteLike(userId: string, songId: string) {
		const isLiked = await this.prisma.likedSong.findUnique({
			where: {
				userId_songId: {
					userId: userId,
					songId: songId
				}
			}
		})

		if (!isLiked)
			throw new BadRequestException(
				'This song is not liked, something went wrong'
			)

		await this.prisma.$transaction([
			this.prisma.likedSong.delete({
				where: {
					userId_songId: {
						userId: userId,
						songId: songId
					}
				}
			}),
			this.prisma.song.update({
				where: { id: songId },
				data: { likes: { decrement: 1 } }
			})
		])

		return {}
	}
}
