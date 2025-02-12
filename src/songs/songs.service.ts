import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SongsService {
	constructor(private readonly prisma: PrismaService) {}
	private readonly songs = [
		{
			id: '123rtu9jfksljfsef-213jfskdfse32-314234f',
			thumbnail: 'thumbnails/cover-2.webp',
			title: 'waaaaaaavyyyyyy',
			author: 'Oliver Francis ~',
			file: '/',
			likes: 5
		},
		{
			id: 'fsgor-zxc-ajnfljakgb',
			thumbnail: 'thumbnails/cover-5.webp',
			title: 'Mob Depp',
			author: 'Frank Sinatra',
			file: '/',
			likes: 41
		}
	]

	private readonly currentTrack = {
		id: 1,
		thumbnail: 'thumbnails/cover-2.webp',
		title: 'waaaaaaavyyyyyy',
		author: 'Oliver Francis ~',
		file: 'files/wavy.mp3',
		likes: 5
	}

	async getLikedSongs(id: string) {
		const likedSongs = await this.prisma.user.findUnique({
			where: { id: id },
			include: { likedSongs: true }
		})
		// return this.songs
		return likedSongs
	}

	async connect() {
		return this.currentTrack
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
		}

		return !isLiked
	}
}
