import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification channel',
    enum: NotificationType,
    example: NotificationType.MAIL,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Notification content',
    example: 'Your note has been shared successfully',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Recipient user ID',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    description: 'Related note ID (optional)',
    example: 12,
  })
  @IsOptional()
  @IsInt()
  noteId?: number;
}
