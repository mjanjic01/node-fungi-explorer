import {MigrationInterface, QueryRunner} from "typeorm";

export class herbariumType1527433785562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "HerbariumType" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_b7c80b08b1c9280e6d694bcef12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Herbarium" ADD "typeId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Herbarium" ADD CONSTRAINT "FK_f92e35ecb355d7718c6b870b5f4" FOREIGN KEY ("typeId") REFERENCES "HerbariumType"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Herbarium" DROP CONSTRAINT "FK_f92e35ecb355d7718c6b870b5f4"`);
        await queryRunner.query(`ALTER TABLE "Herbarium" DROP COLUMN "typeId"`);
        await queryRunner.query(`DROP TABLE "HerbariumType"`);
    }

}
