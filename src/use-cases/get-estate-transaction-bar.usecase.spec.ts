import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetEstateTransactionBarUseCase } from './get-estate-transaction-bar.usecase';
import type { IEstateTransactionRepository } from '../repositories/estate-transaction.repository';

describe('GetEstateTransactionBarUseCase', () => {
  let useCase: GetEstateTransactionBarUseCase;
  let repository: jest.Mocked<IEstateTransactionRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<IEstateTransactionRepository> = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEstateTransactionBarUseCase,
        {
          provide: 'IEstateTransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetEstateTransactionBarUseCase>(
      GetEstateTransactionBarUseCase,
    );
    repository = module.get('IEstateTransactionRepository');
  });

  describe('正常系', () => {
    it('不動産取引データを返すこと', async () => {
      const query = { year: 2017, prefectureCode: 14, type: 2 };
      const mockResult = {
        prefectureCode: '14',
        prefectureName: '神奈川県',
        type: '2',
        years: [{ year: 2017, value: 479830 }],
      };
      repository.findOne.mockResolvedValue(mockResult);

      const result = await useCase.execute(query);

      expect(result).toEqual(mockResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith(query);
    });
  });

  describe('異常系', () => {
    it('データが見つからない場合はNotFoundExceptionを投げること', async () => {
      const query = { year: 2015, prefectureCode: 8, type: 1 };
      repository.findOne.mockResolvedValue(null);

      await expect(useCase.execute(query)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(query)).rejects.toThrow(
        'Estate transaction data not found',
      );
    });

    it('不正な年の場合はBadRequestExceptionを投げること', async () => {
      const query = { year: 2020, prefectureCode: 13, type: 1 };

      await expect(useCase.execute(query)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(query)).rejects.toThrow(
        'Year must be between 2015 and 2018',
      );
    });

    it('関東以外の都道府県の場合はBadRequestExceptionを投げること', async () => {
      const query = { year: 2017, prefectureCode: 1, type: 1 };

      await expect(useCase.execute(query)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(query)).rejects.toThrow(
        'Prefecture code must be in Kanto region: 8, 9, 10, 11, 12, 13, 14',
      );
    });
  });
});
