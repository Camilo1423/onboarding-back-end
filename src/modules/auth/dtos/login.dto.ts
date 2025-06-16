import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'juan.perez@gmail.com',
  })
  user_email: string;

  @IsString({ message: 'La contraseña es requerida' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @ApiProperty({
    description: 'La contraseña del usuario',
    example: '123456',
  })
  user_password: string;
}
