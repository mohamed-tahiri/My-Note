import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'File name',
    example: 'meeting-notes.pdf',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Public file URL',
    example: 'https://cdn.app.com/files/meeting-notes.pdf',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Uploader user ID',
    example: 1,
  })
  @IsInt()
  uploadedById: number;

  @ApiPropertyOptional({
    description: 'Related note ID (optional)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  noteId?: number;
}
