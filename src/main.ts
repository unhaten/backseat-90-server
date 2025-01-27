import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors()
	app.use(cookieParser())

	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(process.env.PORT ?? 8000)
}
bootstrap()
