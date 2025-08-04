import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    // Make sure to return an object with an 'id' property!
    return { id: payload.sub, email: payload.email, role: payload.role, organization: payload.organization };
  }

  async login(user: any) {
    const payload = {
      sub: user.id, // <-- this is required!
      email: user.email,
      role: user.role,
      organization: user.organization,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
