import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsBookableToArtist1700000000007 implements MigrationInterface {
    name = 'AddIsBookableToArtist1700000000007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" ADD "isBookable" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "isBookable"`);
    }
}
