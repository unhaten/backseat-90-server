import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
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
			const currentSong = await lastValueFrom(
				this.httpService.get(process.env.STATION_URL)
			).then(res => res.data)
			return {
				url: currentSong.station.listen_url,
				currentListeners: currentSong.listeners.current,
				song: {
					id: currentSong.now_playing.song.id,
					playedAt: currentSong.now_playing.played_at,
					duration: currentSong.now_playing.duration,
					elapsed: currentSong.now_playing.elapsed,
					thumbnail: currentSong.now_playing.song.art,
					title: currentSong.now_playing.song.title || 'Unknown',
					author: currentSong.now_playing.song.artist || 'Unknown'
				}
			}
		} catch (error) {
			// console.error(error)
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
								// title: true,
								// author: true,
								// thumbnail: true,
								likes: true
							}
						}
					}
				}
			}
		})

		//* Extract and return the relevant details from each liked song
		return user?.likedSongs?.map(likedSong => likedSong.song) || []
	}

	async toggleLike(userId: string, songId: string) {
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
