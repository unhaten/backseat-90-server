import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { env } from 'process'
import { lastValueFrom } from 'rxjs'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SongsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly httpService: HttpService
	) {}
	// private readonly songs = [
	// 	{
	// 		id: '123rtu9jfksljfsef-213jfskdfse32-314234f',
	// 		thumbnail: 'thumbnails/cover-2.webp',
	// 		title: 'waaaaaaavyyyyyy',
	// 		author: 'Oliver Francis ~',
	// 		file: '/',
	// 		likes: 5
	// 	},
	// 	{
	// 		id: 'fsgor-zxc-ajnfljakgb',
	// 		thumbnail: 'thumbnails/cover-5.webp',
	// 		title: 'Mob Depp',
	// 		author: 'Frank Sinatra',
	// 		file: '/',
	// 		likes: 41
	// 	}
	// ]

	// private readonly currentTrack = {
	// 	id: 1,
	// 	thumbnail: 'thumbnails/cover-2.webp',
	// 	title: 'waaaaaaavyyyyyy',
	// 	author: 'Oliver Francis ~',
	// 	file: 'files/wavy.mp3',
	// 	likes: 5
	// }

	async connect() {
		// const currentSong = await this.prisma.song.findFirst({
		// 	select: {
		// 		author: true,
		// 		file: true,
		// 		id: true,
		// 		thumbnail: true,
		// 		title: true
		// 	}
		// })
		// if (!currentSong) throw new BadRequestException('Something went wrong')

		// return currentSong

		const currentSong = await lastValueFrom(
			this.httpService.get(process.env.STATION_URL)
		).then(res => res.data)

		// return currentSong

		return {
			url: currentSong.station.listen_url,
			currentListeners: currentSong.listeners.current,
			song: {
				id: currentSong.now_playing.song.id,
				playedAt: currentSong.now_playing.played_at,
				duration: currentSong.now_playing.duration,
				elapsed: currentSong.now_playing.elapsed,
				thumbnail: currentSong.now_playing.song.art,
				title: currentSong.now_playing.song.text || 'Unknown',
				author: currentSong.now_playing.song.artist || 'Unknown'
			}
		}
	}

	async isSongLiked(userId: string, songId: number) {
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

		// Extract and return the relevant details from each liked song
		return user?.likedSongs?.map(likedSong => likedSong.song) || []
	}

	async toggleLike(userId: string, songId: number) {
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

	async deleteLike(userId: string, songId: number) {
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
