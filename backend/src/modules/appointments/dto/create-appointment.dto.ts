import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

// On définit les options pour Swagger et la validation
export enum AppointmentType {
  PROFESSIONAL = 'Professional',
  PERSONAL = 'Personal',
  MEDICAL = 'Medical',
}

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
    example: '2026-01-12T09:00:00.000Z',
  })
  @IsDateString()
  startAt: string;

  @ApiProperty({
    description: 'End date & time (ISO 8601)',
    example: '2026-01-12T10:00:00.000Z',
  })
  @IsDateString()
  endAt: string;

  @ApiPropertyOptional({
    description: 'Location of the appointment',
    example: 'Conference Room A or Google Meet link',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Category of the appointment',
    enum: AppointmentType,
    example: AppointmentType.PROFESSIONAL,
  })
  @IsNotEmpty()
  @IsEnum(AppointmentType, {
    message: 'Type must be Professional, Personal or Medical',
  })
  type: AppointmentType;

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
