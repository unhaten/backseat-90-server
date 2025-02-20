import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.enableCors({
		origin: ['http://localhost:3000'],
		credentials: true
	})

	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe())
	// await app.listen(process.env.PORT ?? 6000)
	await app.listen(2000)
}
bootstrap()
