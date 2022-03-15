import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurfcampSchema } from 'src/surfcamps/entities/surfcamp.schema';
import { UserSchema } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'Surfcamp', schema: SurfcampSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}