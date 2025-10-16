import { IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class EstateTransactionQueryDto {
  @Type(() => Number)
  @IsInt()
  year: number;

  @Type(() => Number)
  @IsInt()
  prefCode: number;

  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  type: number;
}
