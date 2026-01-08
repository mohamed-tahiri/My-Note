import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'ADMIN', 'MANAGER'],
  })
  @IsString()
  role: string;

  // --- NOUVEAUX CHAMPS OPTIONNELS ---

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'URL to the user avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'fr' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'User interface theme preference',
    enum: ['light', 'dark'],
    default: 'light',
  })
  @IsOptional()
  @IsEnum(['light', 'dark'])
  themePreference?: 'light' | 'dark';
}
