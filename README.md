# # Estate Transaction API

## セットアップ

```bash
npm install
npm run start:dev
```

## テスト

```bash
npm run test       # ユニットテスト
npm run test:e2e   # E2Eテスト
```

## パラメータ

| 名前             | 型     | 説明                         |
| ---------------- | ------ | ---------------------------- |
| `year`           | number | 年度（2015-2018）            |
| `prefectureCode` | number | 都道府県コード（関東: 8-14） |
| `type`           | number | 1: 住宅地, 2: 商業地         |

## API使用例

### 正常系

```bash
# 神奈川県、2017年、商業地
curl "http://localhost:3000/api/v1/townPlanning/estateTransaction/bar?year=2017&prefectureCode=14&type=2"
```

**レスポンス**:

```json
{
  "prefectureCode": "14",
  "prefectureName": "神奈川県",
  "type": "2",
  "years": [{ "year": 2017, "value": 479830 }]
}
```

### エラーケース

```bash
# 年が範囲外（400エラー）
curl "http://localhost:3000/api/v1/townPlanning/estateTransaction/bar?year=2020&prefectureCode=13&type=1"

# 関東以外の都道府県（400エラー）
curl "http://localhost:3000/api/v1/townPlanning/estateTransaction/bar?year=2017&prefectureCode=1&type=1"

# typeが1, 2以外（400エラー）
curl "http://localhost:3000/api/v1/townPlanning/estateTransaction/bar?year=2017&prefectureCode=14&type=3"
```

## アーキテクチャ

Controller → UseCase → Repository → Infrastructure
