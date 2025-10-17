export interface EstateTransactionResult {
  prefectureCode: string;
  prefectureName: string;
  type: string;
  years: Array<{
    year: number;
    value: number;
  }>;
}

export interface IEstateTransactionRepository {
  findOne(query: {
    year: number;
    prefectureCode: number;
    type: number;
  }): Promise<EstateTransactionResult | null>;
}
