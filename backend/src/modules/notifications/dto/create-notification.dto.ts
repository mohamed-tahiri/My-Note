import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateNotificationDto {
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
}
