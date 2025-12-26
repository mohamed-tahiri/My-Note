import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, are we meeting today?',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Sender user ID',
    example: 1,
  })
  @IsInt()
  senderId: number;

  @ApiProperty({
    description: 'Chat ID',
    example: 3,
  })
  @IsInt()
  chatId: number;
}
