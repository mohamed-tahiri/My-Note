import {
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/taskstatus.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish backend API' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Implement Swagger' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'IDs of the assigned users',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  assigneeIds: number[];

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  relatedNoteId?: number;

  @ApiPropertyOptional({ example: '2026-01-10T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
