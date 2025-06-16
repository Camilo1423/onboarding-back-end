import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCollaboratorDto {
  @IsString({ message: 'El id debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El id es requerido' })
  @ApiProperty({
    description: 'El id del colaborador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @ApiProperty({
    description: 'El nombre completo del colaborador',
    example: 'Juan Pérez',
  })
  name_collaborator: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @ApiProperty({
    description: 'El correo electrónico del colaborador',
    example: 'juan.perez@example.com',
  })
  email_collaborator: string;

  @IsString({ message: 'La fecha de ingreso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de ingreso es requerida' })
  @ApiProperty({
    description: 'La fecha de ingreso del colaborador',
    example: '2021-01-01',
  })
  entry_date: string;

  @IsBoolean({ message: 'El estado de bienvenida debe ser un booleano' })
  @IsNotEmpty({ message: 'El estado de bienvenida es requerido' })
  @ApiProperty({
    description: 'El estado de bienvenida del colaborador',
    example: true,
  })
  welcome_onboarding_done: boolean;

  @IsBoolean({ message: 'El estado técnico debe ser un booleano' })
  @IsNotEmpty({ message: 'El estado técnico es requerido' })
  @ApiProperty({
    description: 'El estado técnico del colaborador',
    example: true,
  })
  technical_onboarding_done: boolean;
}
