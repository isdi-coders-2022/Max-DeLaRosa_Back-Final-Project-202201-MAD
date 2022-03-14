import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as expressjwt from 'express-jwt';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT;
    app.enableCors();
    app.use(helmet());
    app.use(
        expressjwt({
            secret: process.env.SECRET,
            algorithms: ['HS256'],
        }).unless({
            path: [
                '/auth/users/login',
                '/auth/users/register',
                '/auth/users/login-token',
                '/auth/surfcamps/login',
                '/auth/surfcamps/register',
                '/auth/surfcamps/login-token',
            ],
        })
    );
    await app.listen(port, () => {
        console.log(`Server started successfully in port ${port}`);
    });
}
bootstrap();
