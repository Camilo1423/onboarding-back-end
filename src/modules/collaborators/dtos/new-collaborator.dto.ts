import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewCollaboratorDto {
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
}
