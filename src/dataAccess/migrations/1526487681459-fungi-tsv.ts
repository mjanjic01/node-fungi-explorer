import {MigrationInterface, QueryRunner} from "typeorm";

export class fungiTsv1526487681459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Fungi" ADD "weightedTsv" tsvector NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Fungi" DROP COLUMN "weightedTsv"`);
    }

}
