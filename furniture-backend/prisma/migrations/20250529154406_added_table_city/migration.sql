-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(52) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");
