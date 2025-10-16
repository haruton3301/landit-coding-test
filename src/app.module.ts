import { Module } from '@nestjs/common';
import { EstateTransactionController } from './controllers/estate-transaction.controller';

@Module({
  imports: [],
  controllers: [EstateTransactionController],
  providers: [],
})
export class AppModule {}
