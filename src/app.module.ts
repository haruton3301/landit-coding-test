import { Module } from '@nestjs/common';
import { EstateTransactionController } from './controllers/estate-transaction.controller';
import { GetEstateTransactionBarUseCase } from './use-cases/get-estate-transaction-bar.usecase';
import { JsonEstateTransactionRepository } from './infrastructure/json-estate-transaction.repository';

@Module({
  imports: [],
  controllers: [EstateTransactionController],
  providers: [
    GetEstateTransactionBarUseCase,
    {
      provide: 'IEstateTransactionRepository',
      useClass: JsonEstateTransactionRepository,
    },
  ],
})
export class AppModule {}
