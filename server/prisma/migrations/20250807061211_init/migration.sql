/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vocab` table. If the table is not empty, all the data it contains will be lost.
*/

-- 🔓 먼저 외래 키 제약 조건 제거
ALTER TABLE `DictEntry` DROP FOREIGN KEY `DictEntry_vocabId_fkey`;
ALTER TABLE `SRSCard` DROP FOREIGN KEY `SRSCard_userId_fkey`;
ALTER TABLE `SRSCard` DROP FOREIGN KEY `SRSCard_categoryId_fkey`;
ALTER TABLE `TutorLog` DROP FOREIGN KEY `TutorLog_userId_fkey`;
ALTER TABLE `UserVocab` DROP FOREIGN KEY `UserVocab_categoryId_fkey`;
ALTER TABLE `UserVocab` DROP FOREIGN KEY `UserVocab_vocabId_fkey`;
ALTER TABLE `UserVocab` DROP FOREIGN KEY `UserVocab_userId_fkey`;

-- ❌ 중복된 DROP FOREIGN KEY 제거: TutorLog 관련 줄은 1줄만 남기고 삭제

-- 🔨 인덱스 제거
DROP INDEX `SRSCard_categoryId_fkey` ON `SRSCard`;
DROP INDEX `TutorLog_userId_fkey` ON `TutorLog`;
DROP INDEX `UserVocab_categoryId_fkey` ON `UserVocab`;
DROP INDEX `UserVocab_vocabId_fkey` ON `UserVocab`;

-- 📦 테이블 삭제
DROP TABLE `category`;
DROP TABLE `user`;
DROP TABLE `vocab`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `profile` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastStudiedAt` DATETIME(3) NULL,
    `streak` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `kind` VARCHAR(191) NOT NULL DEFAULT 'wordbook',
    `nextAlarmAt` DATETIME(3) NULL,
    `alarmActive` BOOLEAN NOT NULL DEFAULT true,
    `remindEvery` INTEGER NULL,

    UNIQUE INDEX `Category_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vocab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lemma` VARCHAR(191) NOT NULL,
    `pos` VARCHAR(191) NOT NULL,
    `plural` VARCHAR(191) NULL,
    `levelCEFR` VARCHAR(191) NOT NULL,
    `freq` INTEGER NULL,
    `source` VARCHAR(191) NULL,

    UNIQUE INDEX `Vocab_lemma_key`(`lemma`),
    INDEX `Vocab_lemma_idx`(`lemma`),
    INDEX `Vocab_source_idx`(`source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DictEntry` ADD CONSTRAINT `DictEntry_vocabId_fkey` FOREIGN KEY (`vocabId`) REFERENCES `Vocab`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SRSCard` ADD CONSTRAINT `SRSCard_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SRSCard` ADD CONSTRAINT `SRSCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TutorLog` ADD CONSTRAINT `TutorLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserVocab` ADD CONSTRAINT `UserVocab_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserVocab` ADD CONSTRAINT `UserVocab_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserVocab` ADD CONSTRAINT `UserVocab_vocabId_fkey` FOREIGN KEY (`vocabId`) REFERENCES `Vocab`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
