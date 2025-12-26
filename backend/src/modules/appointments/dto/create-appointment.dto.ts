import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment title',
    example: 'Project review meeting',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Start date & time (ISO 8601)',
    example: '2025-01-12T09:00:00.000Z',
  })
  @IsDateString()
  startAt: string;

  @ApiProperty({
    description: 'End date & time (ISO 8601)',
    example: '2025-01-12T10:00:00.000Z',
  })
  @IsDateString()
  endAt: string;

  @ApiProperty({
    description: 'Owner user ID',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    description: 'Assigned user ID (optional)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  assignedToId?: number;
}
