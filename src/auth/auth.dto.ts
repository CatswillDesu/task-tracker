import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRoles } from './user.entity';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UserDto {
  id: number;

  email: string;

  role: UserRoles;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  updatedAt: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  deletedAt: Date;
}
