import {MigrationInterface, QueryRunner} from "typeorm";

export class imageType1525645607853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Observation" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "Observation" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Observation" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "Observation" ADD "image" bytea`);
    }

}
