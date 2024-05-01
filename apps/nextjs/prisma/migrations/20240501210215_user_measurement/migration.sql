-- CreateTable
CREATE TABLE "UserMeasurements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "UserMeasurements_pkey" PRIMARY KEY ("id")
);
