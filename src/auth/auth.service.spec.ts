import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../models/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UsersService', () => {
    describe('When calling the services with correct parameters', () => {
        let service: AuthService;

        const testUser = {
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            role: 'user',
        };
        const testUserLogin = {
            username: 'test',
            password: 'test',
        };

        const mockRepository = {
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(testUser),
        };
        beforeEach(async () => {
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        test('When calling registerUser it returns the test user', async () => {
            const result = await service.registerUser(testUser);
            expect(result).toBe(testUser);
        });

        test('When calling loginUser it returns a token', async () => {
            const result = await service.loginUser(testUserLogin);
            expect(result).toEqual({ token: 'token' });
        });

        test('When calling loginTokenUser it returns a user', async () => {
            jwt.verify.mockReturnValue(testUser);
            const result = await service.loginTokenUser(
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmY1MzQ3NDc3NjFlZDZiODFiNDI3MiIsIm5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NDcyNzIzMzV9.YItW0NY-gM88ah7gVANJrpeZEJwjv8-W0NJCItHcKQI`
            );
            expect(result).toEqual(testUser);
        });

        test('When calling loginTokenUser with a bad token it throws', async () => {
            jwt.verify.mockReturnValue(false);
            try {
                await service.loginTokenUser(`Bearer aaaa`);
            } catch (error) {
                expect(error.message).toEqual('Unauthorized');
            }
        });
    });

    describe('When calling loginUser with a bad user', () => {
        let service: AuthService;

        const testUser = {
            username: 'test',
            password: 'test',
            name: 'test',
            lastName: 'test',
            role: 'user',
        };
        const testUserLogin = {
            username: 'test',
            password: 'test',
        };

        const mockRepository = {
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(false),
        };
        test('When calling loginUser with a bad user, it throws', async () => {
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginUser(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
        test('When calling loginUser with a bad user, it throws', async () => {
            mockRepository.findOne = jest
                .fn()
                .mockResolvedValue({ username: 'test', password: 'test' });
            bcrypt.compareSync.mockReturnValue(false);
            jwt.sign.mockReturnValue('token');

            const module: TestingModule = await Test.createTestingModule({
                providers: [AuthService],
                imports: [
                    MongooseModule.forFeature([
                        { name: User.name, schema: UserSchema },
                    ]),
                ],
            })
                .overrideProvider(getModelToken('User'))
                .useValue(mockRepository)
                .compile();

            service = module.get<AuthService>(AuthService);
            try {
                await service.loginUser(testUserLogin);
            } catch (error) {
                expect(error.response.message).toBe(
                    'Username or password incorrect'
                );
            }
        });
    });
});
