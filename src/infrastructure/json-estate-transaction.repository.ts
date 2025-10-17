import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  IEstateTransactionRepository,
  EstateTransactionResult,
} from '../repositories/estate-transaction.repository';

interface EstateTransactionJson {
  year: number;
  prefectureCode: number;
  type: number;
  data: {
    result: {
      prefectureCode: string;
      prefectureName: string;
      type: string;
      years: Array<{
        year: number;
        value: number;
      }>;
    };
  };
}

@Injectable()
export class JsonEstateTransactionRepository
  implements IEstateTransactionRepository
{
  private data: EstateTransactionJson[];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const filePath = path.join(
      process.cwd(),
      'assets',
      'estate_transactions.json',
    );

    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      this.data = JSON.parse(rawData) as EstateTransactionJson[];
    } catch {
      throw new Error('Failed to load estate transaction data');
    }
  }

  async findOne(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionResult | null> {
    const item: EstateTransactionJson | undefined = this.data.find(
      (item: EstateTransactionJson) =>
        item.year === query.year &&
        item.prefectureCode === query.prefectureCode &&
        item.type === query.type,
    );

    if (!item) {
      return Promise.resolve(null);
    }

    return Promise.resolve(item.data.result);
  }
}
