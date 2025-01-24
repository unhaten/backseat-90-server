import { Injectable } from '@nestjs/common'

@Injectable()
export class SongsService {
	private readonly songs = [
		{
			id: '123rtu9jfksljfsef-213jfskdfse32-314234f',
			image: '/',
			title: 'waaaaaaavyyyyyy',
			artist: 'Oliver Francis ~',
			file: '/'
		},
		{
			id: 'fsgor-zxc-ajnfljakgb',
			image: '/',
			title: 'Mob Depp',
			artist: 'Snoop Dogg',
			file: '/'
		}
	]

	async getSongs() {
		return this.songs
	}
}
