/*
  Warnings:

  - The values [PENDING,SHIPPED,COMPLETED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOTDEFINED,FLOOR,WALL,OUTDOOR,PREMIUM,PORCELAIN,CERAMIC,GRANITE] on the enum `TileCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOTDEFINED] on the enum `TileFinish` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `tileId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `EndUser` table. All the data in the column will be lost.
  - The `lookingFor` column on the `EndUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `EndUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `application` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mount` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `material` on the `Tile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TileColor" AS ENUM ('YELLOW', 'WHITE', 'BLACK', 'GRAY', 'GREEN', 'IVORY', 'BEIGE', 'BLUE', 'BROWN', 'CREAM');

-- CreateEnum
CREATE TYPE "TileApplication" AS ENUM ('LIVING_ROOM', 'HALL', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'BALCONY', 'BAR_UNIT', 'PASSAGE', 'FOYER', 'TV_UNIT');

-- CreateEnum
CREATE TYPE "TileMaterial" AS ENUM ('MARBLE_STONE', 'GLASS', 'VITRIFIED', 'METAL', 'PORCELAIN', 'STEEL', 'CLAY', 'CERAMIC', 'WOOD', 'CHARCOAL');

-- CreateEnum
CREATE TYPE "TileMount" AS ENUM ('WALL', 'FLOOR', 'COUNTERTOP');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('NEW', 'CONFIRMED', 'CANCELLED', 'COMPLETE', 'REJECTED');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TileCategory_new" AS ENUM ('LIVING_ROOM', 'TV_UNIT', 'FOYER', 'KITCHEN', 'DIGITAL_WALL_TILE_CONCEPT', 'KITCHEN_CUP_N_SAUCER_THEME', 'GLASS_BORDERS', 'RUSTIC_MATT_FLOOR_TILE', 'SWIMMING_POOL_MOSAICS', 'HI_GLOSS_VITRIFIED_TILES', 'END_MATCH_TILE', 'VITRIFIED_COUNTERTOPS', 'T3D_TILES', 'TERRAZZO_TILES', 'BORDER_TILES', 'COOL_TILES', 'VENKATESWARA_TILES_AND_STONES', 'TEXTURED_TILES', 'PARKING_TILES', 'BALCONY', 'BATHROOM', 'BEDROOM', 'POOJA_ROOM', 'ELEVATION_TILES', 'MOSAIC_TILES', 'GEOMETRIC_TILES', 'ANTI_SKID_TILES', 'SUBWAY_TILES', 'DOUBLE_CHARGE_VITRIFIED', 'GLAZED_VITRIFIED', 'PLAIN_COLOR_TILES', 'U_PROFILE', 'T_PROFILE', 'MARBLE_TILES', 'GOD_PICTURES', 'ATHANGUDI_TILES', 'STEP_TILES', 'METAL_BEADING', 'GVT_STEP', 'POSTER_WALL_TILE', 'KRISHNA_TILES_AND_STONES', 'GANESHA_TILES_AND_STONES', 'TERRACOTTA_CLAY_JALI', 'LIMESTONE_TILES', 'NANO_POLISHED', 'BRICK_TILES', 'STEPTEST', 'T15MM_VITRIFIED_TILES', 'SOLID_COLOR_TILES', 'PASTEL_COLOR_TILES', 'CERAMIC_TILE', 'PORCELAIN_TILE', 'VITRIFIED_TILES', 'SPIRITUAL_THEME_POOJA_ROOM_TILES', 'MONOCHROME_TILES', 'ABSTRACT_TILES', 'HIGHLIGHTER_TILES', 'FULL_BODY', 'FULL_BODY_STEP', 'FULL_BODY_VITRIFIED', 'BUDDHA_TILES_AND_STONES', 'THIRD_FIRE_VITRIFIED_TILES', 'CHARCOAL_PANELS', 'FLUTED_WALL_CEILING_PANELS', 'BOTTOCHINO_TILES', 'MULTI_COLOUR_TILES', 'DHOLPURI_TILES', 'BOOKMATCH_TILES', 'WOODEN_TILES', 'WOODEN_WALL_TILES', 'CARRARA_TILES', 'BLUE_POTTERY_TILES', 'CARPET_RANGOLI_TILES', 'TROPICAL_TILES', 'MOROCCAN_TILES', 'METALLIC_TILES', 'MODULAR_RUSTIC', 'WOODEN_FLOOR_TILES', 'IMPORTED_TILES', 'HEXAGON_TILES', 'FLUTED_TILE', 'LOUVER_PANELS', 'NATURAL_STONE_CLADDING', 'NATURAL_STONE_MURAL', 'OCTAGON_TILES', 'PLAIN_PARKING_TILE', 'DIGITAL_PARKING_TILE');
ALTER TABLE "Tile" ALTER COLUMN "category" TYPE "TileCategory_new" USING ("category"::text::"TileCategory_new");
ALTER TYPE "TileCategory" RENAME TO "TileCategory_old";
ALTER TYPE "TileCategory_new" RENAME TO "TileCategory";
DROP TYPE "TileCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TileFinish_new" AS ENUM ('GLASS', 'LAPPATO', 'SUGAR', 'GLOSSY', 'CARVING_TILES', 'METALIC', 'MATTE', 'SATIN', 'RUSTIC', 'HI_GLOSSY');
ALTER TABLE "Tile" ALTER COLUMN "finish" TYPE "TileFinish_new" USING ("finish"::text::"TileFinish_new");
ALTER TYPE "TileFinish" RENAME TO "TileFinish_old";
ALTER TYPE "TileFinish_new" RENAME TO "TileFinish";
DROP TYPE "TileFinish_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tileId_fkey";

-- DropIndex
DROP INDEX "Tile_createdAt_idx";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "name",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "pincode",
DROP COLUMN "tileId",
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "meetingDate" TIMESTAMP(3),
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "country",
DROP COLUMN "email";

-- AlterTable
ALTER TABLE "EndUser" DROP COLUMN "role",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "lookingFor",
ADD COLUMN     "lookingFor" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Tile" ADD COLUMN     "application" "TileApplication" NOT NULL,
ADD COLUMN     "color" "TileColor" NOT NULL,
ADD COLUMN     "mount" "TileMount" NOT NULL,
DROP COLUMN "material",
ADD COLUMN     "material" "TileMaterial" NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "quantityBox" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingTile" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "BookingTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_tileId_key" ON "CartItem"("cartId", "tileId");

-- CreateIndex
CREATE INDEX "BookingTile_bookingId_idx" ON "BookingTile"("bookingId");

-- CreateIndex
CREATE INDEX "BookingTile_tileId_idx" ON "BookingTile"("tileId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");

-- CreateIndex
CREATE INDEX "Wishlist_tileId_idx" ON "Wishlist"("tileId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_tileId_key" ON "Wishlist"("userId", "tileId");

-- CreateIndex
CREATE INDEX "EndUser_email_idx" ON "EndUser"("email");

-- CreateIndex
CREATE INDEX "EndUser_city_idx" ON "EndUser"("city");

-- CreateIndex
CREATE INDEX "Tile_category_idx" ON "Tile"("category");

-- CreateIndex
CREATE INDEX "Tile_isPublished_idx" ON "Tile"("isPublished");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTile" ADD CONSTRAINT "BookingTile_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTile" ADD CONSTRAINT "BookingTile_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "EndUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
