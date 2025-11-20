import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  });
  await app.listen(3001);
  console.log(`\n✅ Backend API running at http://localhost:3001\n`);
}
bootstrap();