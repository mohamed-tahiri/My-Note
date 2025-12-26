import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Finish backend API',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Implement Swagger and database relations',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID of the assigned user',
    example: 2,
  })
  @IsInt()
  assigneeId: number;

  @ApiPropertyOptional({
    description: 'Related note ID (optional)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  relatedNoteId?: number;

  @ApiPropertyOptional({
    description: 'Task due date (ISO format)',
    example: '2025-01-10T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
