
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, {
    message: 'Introduz um endereço de e-mail válido.',
  })
  @MaxLength(254, {
    message: 'O e-mail não pode exceder 254 caracteres.',
  })
  email: string;

  @IsString({
    message: 'A senha deve ser um texto válido.',
  })
  @MinLength(1, {
    message: 'Introduz a tua senha.',
  })
  @MaxLength(72, {
    message: 'A senha é demasiado longa.',
  })
  password: string;
}
