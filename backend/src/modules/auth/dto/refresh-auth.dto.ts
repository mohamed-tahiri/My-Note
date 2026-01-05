import { IsString, IsNumber } from 'class-validator';

export class RefreshAuthDto {
  @IsNumber()
  userId: number;
  @IsString()
  refreshToken: string;
}
