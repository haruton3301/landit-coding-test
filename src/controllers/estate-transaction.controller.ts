import { Controller, Get, Query } from '@nestjs/common';
import { EstateTransactionQueryDto } from './dto/estate-transaction-query.dto';
import { GetEstateTransactionBarUseCase } from '../use-cases/get-estate-transaction-bar.usecase';

@Controller('api/v1/townPlanning/estateTransaction')
export class EstateTransactionController {
  constructor(
    private readonly getEstateTransactionBarUseCase: GetEstateTransactionBarUseCase,
  ) {}

  @Get('bar')
  async getBar(@Query() query: EstateTransactionQueryDto) {
    return await this.getEstateTransactionBarUseCase.execute({
      year: query.year,
      prefectureCode: query.prefectureCode,
      type: query.type,
    });
  }
}
