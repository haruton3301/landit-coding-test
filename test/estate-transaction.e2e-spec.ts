/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('EstateTransaction E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/townPlanning/estateTransaction/bar', () => {
    describe('正常系', () => {
      it('不動産取引データを返すこと', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, prefectureCode: 14, type: 2 })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('prefectureCode', '14');
            expect(res.body).toHaveProperty('prefectureName', '神奈川県');
            expect(res.body).toHaveProperty('type', '2');
            expect(res.body).toHaveProperty('years');
            expect(res.body.years).toHaveLength(1);
            expect(res.body.years[0]).toHaveProperty('year', 2017);
            expect(res.body.years[0]).toHaveProperty('value', 479830);
          });
      });
    });

    describe('DTOバリデーションエラー', () => {
      it('yearが数値でない場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 'invalid', prefectureCode: 14, type: 2 })
          .expect(400);
      });

      it('prefectureCodeが数値でない場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, prefectureCode: 'invalid', type: 2 })
          .expect(400);
      });

      it('typeが1または2以外の場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, prefectureCode: 14, type: 3 })
          .expect(400);
      });

      it('yearが欠けている場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ prefectureCode: 14, type: 2 })
          .expect(400);
      });

      it('prefectureCodeが欠けている場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, type: 2 })
          .expect(400);
      });

      it('typeが欠けている場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, prefectureCode: 14 })
          .expect(400);
      });
    });

    describe('UseCaseビジネスロジックエラー', () => {
      it('年が2015より小さい場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2014, prefectureCode: 13, type: 1 })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Year must be between 2015 and 2018');
          });
      });

      it('年が2018より大きい場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2019, prefectureCode: 13, type: 1 })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Year must be between 2015 and 2018');
          });
      });

      it('関東以外の都道府県コードの場合は400エラー', () => {
        return request(app.getHttpServer())
          .get('/api/v1/townPlanning/estateTransaction/bar')
          .query({ year: 2017, prefectureCode: 1, type: 1 })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe(
              'Prefecture code must be in Kanto region: 8, 9, 10, 11, 12, 13, 14',
            );
          });
      });
    });
  });
});
