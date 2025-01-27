import { Injectable } from '@nestjs/common'

@Injectable()
export class SongsService {
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
		id: '123rtu9jfksljfsef-213jfskdfse32-314234f',
		thumbnail: 'thumbnails/cover-2.webp',
		title: 'waaaaaaavyyyyyy',
		author: 'Oliver Francis ~',
		file: 'files/wavy.mp3',
		likes: 5
	}

	async getSongs() {
		return this.songs
	}

	async connect() {
		return this.currentTrack
	}

}
