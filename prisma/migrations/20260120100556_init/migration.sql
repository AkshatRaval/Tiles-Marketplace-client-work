-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'DEALER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TileCategory" AS ENUM ('NOTDEFINED', 'FLOOR', 'WALL', 'BATHROOM', 'KITCHEN', 'OUTDOOR', 'PREMIUM', 'PORCELAIN', 'CERAMIC', 'GRANITE');

-- CreateEnum
CREATE TYPE "TileFinish" AS ENUM ('NOTDEFINED', 'GLOSSY', 'MATTE', 'SATIN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "finish" "TileFinish" NOT NULL,
    "category" "TileCategory" NOT NULL,
    "pricePerSqft" DOUBLE PRECISION NOT NULL,
    "pricePerBox" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "pdfUrl" TEXT,
    "dealerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TileImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "duty" TEXT,
    "lookingFor" TEXT,
    "referral" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EndUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT,
    "quantityBox" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "tileId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tile_sku_key" ON "Tile"("sku");

-- CreateIndex
CREATE INDEX "Tile_createdAt_idx" ON "Tile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_email_key" ON "EndUser"("email");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- AddForeignKey
ALTER TABLE "Tile" ADD CONSTRAINT "Tile_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TileImage" ADD CONSTRAINT "TileImage_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
