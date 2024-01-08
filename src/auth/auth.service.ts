import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { LoginDto, RegisterDto, UserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private map(model: UserEntity): UserDto {
    const dto = new UserDto();
    dto.id = model.id;
    dto.email = model.email;
    dto.role = model.role;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    dto.deletedAt = model.deletedAt;

    return dto;
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save({
      ...dto,
      password: hashedPassword,
    });

    return this.map(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credenitals');
    }

    const passwordIsMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );
    if (!passwordIsMatching) {
      throw new UnauthorizedException('Invalid credenitals');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(req: Request) {
    const user = await this.userRepository.findOne({
      where: { id: req['user']['id'] },
    });

    return this.map(user);
  }

  // TODO: использовать role guard
  async findUsers() {
    return this.userRepository.find();
  }
}
