import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  //Global Middleware 설정 -> Cors 속성 활성화
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true, // DTO에 없는 속성은 무조건 거른다
      forbidNonWhitelisted:true, // 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생
      transform: true, 
      /*
        localhost:#000/movie/1 이렇게 하면 1이 string으로 들어오고
        string 값을 number 로 바꿔주는 작업이 필요한데 transform = true로 하면
        자동으로 바꿔줌
      */
      disableErrorMessages: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Unithon Samshisekki API Docs')
    .setDescription('삼시세끼의 API 문서입니다.')
    .setVersion('1.0.0')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        in: 'header',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
  
}
bootstrap();
