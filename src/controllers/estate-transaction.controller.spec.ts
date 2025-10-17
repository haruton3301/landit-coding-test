import { Test, TestingModule } from '@nestjs/testing';
import { EstateTransactionController } from './estate-transaction.controller';
import { GetEstateTransactionBarUseCase } from '../use-cases/get-estate-transaction-bar.usecase';
import { EstateTransactionQueryDto } from './dto/estate-transaction-query.dto';

describe('EstateTransactionController', () => {
  let controller: EstateTransactionController;
  let useCase: jest.Mocked<GetEstateTransactionBarUseCase>;

  beforeEach(async () => {
    const mockUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstateTransactionController],
      providers: [
        {
          provide: GetEstateTransactionBarUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<EstateTransactionController>(
      EstateTransactionController,
    );
    useCase = module.get(GetEstateTransactionBarUseCase);
  });

  describe('GET /bar', () => {
    it('不動産取引データを返すこと', async () => {
      const query: EstateTransactionQueryDto = {
        year: 2017,
        prefectureCode: 14,
        type: 2,
      };

      const mockResult = {
        prefectureCode: '14',
        prefectureName: '神奈川県',
        type: '2',
        years: [{ year: 2017, value: 479830 }],
      };

      useCase.execute.mockResolvedValue(mockResult);

      const result = await controller.getBar(query);

      expect(result).toEqual(mockResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(useCase.execute).toHaveBeenCalledWith(query);
    });
  });
});
