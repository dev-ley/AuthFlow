
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        emailVerifiedAt: true,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Este endereço de e-mail já está registado.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenHash = this.hashToken(verificationToken);
    const verificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    let user: { id: string; name: string; email: string };

    try {
      user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
          emailVerificationTokenHash: verificationTokenHash,
          emailVerificationExpiresAt: verificationExpiresAt,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Este endereço de e-mail já está registado.',
        );
      }

      throw error;
    }

    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );
    } catch {
      await this.prisma.user
        .delete({
          where: { id: user.id },
        })
        .catch(() => undefined);

      throw new InternalServerErrorException(
        'Não foi possível enviar o e-mail de confirmação. Tenta novamente.',
      );
    }

    return {
      message:
        'Conta criada! Verifica a tua caixa de entrada para confirmares o e-mail.',
    };
  }

  async verifyEmail(token: string) {
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      throw new BadRequestException('O link de confirmação é inválido.');
    }

    const tokenHash = this.hashToken(token);
    const now = new Date();

    const result = await this.prisma.user.updateMany({
      where: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: {
          gt: now,
        },
        emailVerifiedAt: null,
      },
      data: {
        emailVerifiedAt: now,
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'O link é inválido, já foi utilizado ou expirou.',
      );
    }

    return {
      message: 'E-mail confirmado com sucesso! Já podes iniciar sessão.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Confirma o teu e-mail antes de iniciar sessão.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    if (!user || !user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Sessão inválida. Inicia sessão novamente.',
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
