import { JsonEstateTransactionRepository } from './json-estate-transaction.repository';

describe('JsonEstateTransactionRepository', () => {
  let repository: JsonEstateTransactionRepository;

  beforeEach(() => {
    repository = new JsonEstateTransactionRepository();
  });

  describe('findOne', () => {
    it('条件に一致するデータを返すこと', async () => {
      const query = { year: 2017, prefectureCode: 14, type: 2 };

      const result = await repository.findOne(query);

      expect(result).toBeDefined();
      expect(result?.prefectureCode).toBe('14');
      expect(result?.prefectureName).toBe('神奈川県');
      expect(result?.type).toBe('2');
      expect(result?.years).toHaveLength(1);
      expect(result?.years[0].year).toBe(2017);
      expect(result?.years[0].value).toBe(479830);
    });

    it('データが見つからない場合はnullを返すこと', async () => {
      const query = { year: 2019, prefectureCode: 14, type: 2 };

      const result = await repository.findOne(query);

      expect(result).toBeNull();
    });
  });
});
