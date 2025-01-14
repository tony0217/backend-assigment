import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function Main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  const configService = app.get(ConfigService);
  const port = configService.get("APP_PORT") || process.env.PORT;
  const mode = process.env.NODE_ENV;
  await app.listen(port);

  Logger.log(
    `⚡ RUNNING AT PORT: \x1b[31m${port} \x1b[32mIN \x1b[36m${mode.toUpperCase()} \x1b[32mmode`
  );
}
Main();
