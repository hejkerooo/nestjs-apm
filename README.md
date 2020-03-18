# elastic-apm-nest
[NestJS](https://github.com/nestjs/nest) Elastic APM library.

## Installation
`npm i elastic-apm-nest --save`

## Usage
To your `tsconfig.json` add following lines:
```json
"paths": {
      "elastic-apm-node": [
        "./node_modules/elastic-apm-nest/types/elastic-apm-node/index.d.ts"
      ]
    }
```

```typescript

import { APM_MIDDLEWARE, ApmErrorInterceptor, ApmUserContextInterceptor, initializeAPMAgent } from 'elastic-apm-nest';

initializeAPMAgent({
  serviceName: '',
  secretToken: '',
  serverUrl: '',
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apmMiddleware = app.get(APM_MIDDLEWARE);
  const globalInterceptors = [
    app.get(ApmUserContextInterceptor),
    app.get(ApmErrorInterceptor),
  ];

  app.useGlobalInterceptors(... globalInterceptors);

  app.use(apmMiddleware);
  await app.listen(3000);
}
bootstrap();
```

As NestJS is not allowing you to use some sort of `ConfigService` there you need to add to your repository [dotenv](https://www.npmjs.com/package/dotenv) package or something similar to pass configuration.

## Adding ApmModule

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApmModule } from 'elastic-apm-nest';

@Module({
  imports: [
    ApmModule.forRootAsync({
      useFactory: async () => {
        return {
          httpUserMapFunction: (req: any) => {
            return {
              id: req.user.id,
              username: req.user.username,
              email: req.user.email,
            };
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Module exports
`ApmService` - Wrapper for raw APM Agent instance
`APM_INSTANCE` - Raw APM Agent instance
`APM_MIDDLEWARE` - APM Raw Http middleware for express
`APM_OPTIONS` - Current configuration for elastic-apm-nest

## Default ApmUserContextInterceptor behavior
It won't set UserContext in transaction if `httpUserMapFunction` is not provided

## Handling not supported methods
You can inject `APM_INSTANCE` which contains created APM instance via `initializeAPMAgent` function.

### Testing locally
- Run `npm run build:test`
- Copy absolute path to generated `.tgz` file
- Run in other project `npm install <path_to_.tgz_file>`

### ToDo
- [] Improve tests
- [] Add examples
- [] Add renovate
- [x] Improve typings for elastic-apm

