import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstateTransactionController } from './controllers/estate-transaction.controller';

@Module({
  imports: [],
  controllers: [AppController, EstateTransactionController],
  providers: [AppService],
})
export class AppModule {}
