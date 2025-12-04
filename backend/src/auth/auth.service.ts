import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(email: string, pass: string) {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) throw new UnauthorizedException('این ایمیل قبلاً ثبت شده است');
    return this.usersService.create(email, pass);
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('ایمیل یا رمز اشتباه است');
    const ok = await bcrypt.compare(pass, user.password_hash);
    if (!ok) throw new UnauthorizedException('ایمیل یا رمز اشتباه است');
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
