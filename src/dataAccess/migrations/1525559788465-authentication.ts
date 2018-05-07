import {MigrationInterface, QueryRunner} from "typeorm";

export class authentication1525559788465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "User" RENAME COLUMN "passwordSalt" TO "username"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "username" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "username" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "User" RENAME COLUMN "username" TO "passwordSalt"`);
    }

}
