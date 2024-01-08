import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    AuthService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}
