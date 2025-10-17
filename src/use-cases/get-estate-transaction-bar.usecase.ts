import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type {
  EstateTransactionResult,
  IEstateTransactionRepository,
} from '../repositories/estate-transaction.repository';

@Injectable()
export class GetEstateTransactionBarUseCase {
  private readonly SUPPORTED_PREFECTURES = [8, 9, 10, 11, 12, 13, 14];
  private readonly SUPPORTED_YEARS = { min: 2015, max: 2018 };

  constructor(
    @Inject('IEstateTransactionRepository')
    private readonly repository: IEstateTransactionRepository,
  ) {}

  async execute(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionResult> {
    this.validateYear(query.year);
    this.validatePrefecture(query.prefectureCode);

    const estateTransaction = await this.repository.findOne(query);

    if (!estateTransaction) {
      throw new NotFoundException('Estate transaction data not found');
    }

    return estateTransaction;
  }

  private validateYear(year: number): void {
    if (year < this.SUPPORTED_YEARS.min || year > this.SUPPORTED_YEARS.max) {
      throw new BadRequestException(
        `Year must be between ${this.SUPPORTED_YEARS.min} and ${this.SUPPORTED_YEARS.max}`,
      );
    }
  }

  private validatePrefecture(prefectureCode: number): void {
    if (!this.SUPPORTED_PREFECTURES.includes(prefectureCode)) {
      throw new BadRequestException(
        `Prefecture code must be in Kanto region: ${this.SUPPORTED_PREFECTURES.join(', ')}`,
      );
    }
  }
}
