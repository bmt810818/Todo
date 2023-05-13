import {ApplicationConfig, TodoListApplication} from './application';
import { MySequence } from './sequence';
import { BcryptHasher } from './services/hash.password.bcrypt';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoListApplication(options);
  await app.boot();
  await app.migrateSchema();
  //seed data
  await app.start();
  app.bind('controllers.PasswordHasher').toClass(BcryptHasher);
  app.sequence(MySequence);
  app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);
  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
