
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  })
  @MaxLength(100, {
    message: 'O nome não pode exceder 100 caracteres.',
  })
  name: string;

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

  @IsString()
  @MinLength(12, {
    message: 'A senha deve ter pelo menos 12 caracteres.',
  })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  @Matches(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula.',
  })
  @Matches(/[0-9]/, {
    message: 'A senha deve conter pelo menos um número.',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'A senha deve conter pelo menos um símbolo especial.',
  })
  @MaxLength(72, {
    message: 'A senha não pode exceder 72 caracteres.',
  })
  password: string;
}
