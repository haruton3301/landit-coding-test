import { Controller, Get, Query } from '@nestjs/common';
import { EstateTransactionQueryDto } from './dto/estate-transaction-query.dto';

@Controller('api/v1/townPlanning/estateTransaction')
export class EstateTransactionController {
  @Get('bar')
  async getBar(@Query() query: EstateTransactionQueryDto) {
    return {
      message: 'dummy',
      query,
    };
  }
}
