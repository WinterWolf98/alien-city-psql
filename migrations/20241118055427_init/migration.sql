-- CreateTable
CREATE TABLE "alien_city" (
    "entryid" SERIAL NOT NULL,
    "creatorid" DECIMAL,
    "createdtime" DATE,
    "cityname" VARCHAR(100),

    CONSTRAINT "alien_city_pkey" PRIMARY KEY ("entryid")
);
