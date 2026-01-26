import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateChatDto {
  @ApiPropertyOptional({
    description: 'Name of the chat (required for task groups)',
    example: 'Chat: Finaliser le design Slate',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Type of chat',
    enum: ['private', 'task_group'],
    default: 'private',
  })
  @IsOptional()
  @IsEnum(['private', 'task_group'])
  type?: string = 'private';

  @ApiProperty({
    description: 'owner of the chat',
    example: 1,
    type: Number,
  })
  @IsNumber()
  ownerId?: number;

  @ApiProperty({
    description: 'List of user IDs participating in the chat',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  participantIds: number[];
}
