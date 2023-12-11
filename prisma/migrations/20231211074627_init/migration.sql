-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "category_name_slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "food_name_slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Province" ALTER COLUMN "province_name_slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Region" ALTER COLUMN "region_slug" DROP NOT NULL;
