import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Note title',
    example: 'Meeting notes',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Note content',
    example: 'Discuss project roadmap and deadlines',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID of the user who owns the note',
    example: 1,
  })
  @IsInt()
  userId: number;
}
