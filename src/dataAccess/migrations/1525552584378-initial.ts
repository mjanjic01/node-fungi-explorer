import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1525552584378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "Edibility" ("id" SERIAL NOT NULL, "rating" character varying(50) NOT NULL, CONSTRAINT "PK_a2c4862b25419384ea244a47e38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Genus" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_a55860fbb0cb692257e2a127c54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Species" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "genusId" integer NOT NULL, CONSTRAINT "PK_b8ed2b18023596536c8d028e7c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Fungi" ("id" SERIAL NOT NULL, "variant" character varying(50), "name" character varying(255), "protected" boolean, "speciesId" integer NOT NULL, "edibilityId" integer, CONSTRAINT "PK_c8d72fb744031f70f86138ee149" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Location" ("id" SERIAL NOT NULL, "longitude" numeric(9,6) NOT NULL, "latitude" numeric(9,6) NOT NULL, CONSTRAINT "PK_d0125e359cde2707aec388b9c59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Observation" ("id" SERIAL NOT NULL, "description" character varying, "date" date NOT NULL, "image" bytea, "fungiId" integer NOT NULL, "locationId" integer, "herbariumId" integer, CONSTRAINT "REL_bdb021a8983d56226c2ad95cf3" UNIQUE ("locationId"), CONSTRAINT "PK_4d40680df62773a683ba69e0635" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Herbarium" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" character varying, "private" boolean NOT NULL, CONSTRAINT "PK_94fd1122a8944e437278fb368fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "passwordHash" character varying(128) NOT NULL, "passwordSalt" character varying(128) NOT NULL, "clubId" integer, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Club" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "address" character varying(50), CONSTRAINT "PK_c0157ba1c3d22510cafe903dc63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserHerbarium" ("userId" integer NOT NULL, "herbariumId" integer NOT NULL, CONSTRAINT "PK_418135762e7f66f2cc3dec71a3b" PRIMARY KEY ("userId", "herbariumId"))`);
        await queryRunner.query(`ALTER TABLE "Species" ADD CONSTRAINT "FK_cb3b94fae5b15c8971a1abb1645" FOREIGN KEY ("genusId") REFERENCES "Genus"("id")`);
        await queryRunner.query(`ALTER TABLE "Fungi" ADD CONSTRAINT "FK_7e681dd505dd4e9834fdc1f8a32" FOREIGN KEY ("speciesId") REFERENCES "Species"("id")`);
        await queryRunner.query(`ALTER TABLE "Fungi" ADD CONSTRAINT "FK_cc000951fddd2be6eb0c35c3f3b" FOREIGN KEY ("edibilityId") REFERENCES "Edibility"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "Observation" ADD CONSTRAINT "FK_2d52cc589c1b69b1423947d993d" FOREIGN KEY ("fungiId") REFERENCES "Fungi"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Observation" ADD CONSTRAINT "FK_bdb021a8983d56226c2ad95cf3e" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "Observation" ADD CONSTRAINT "FK_77590fb6526c7475868b8f25c8b" FOREIGN KEY ("herbariumId") REFERENCES "Herbarium"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_c885b5a45f242e45ab666f92db5" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "UserHerbarium" ADD CONSTRAINT "FK_c404d1f3caf9785bb9a6cf95e8a" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserHerbarium" ADD CONSTRAINT "FK_4cfee8ffe6a823357268ef4d842" FOREIGN KEY ("herbariumId") REFERENCES "Herbarium"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "UserHerbarium" DROP CONSTRAINT "FK_4cfee8ffe6a823357268ef4d842"`);
        await queryRunner.query(`ALTER TABLE "UserHerbarium" DROP CONSTRAINT "FK_c404d1f3caf9785bb9a6cf95e8a"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_c885b5a45f242e45ab666f92db5"`);
        await queryRunner.query(`ALTER TABLE "Observation" DROP CONSTRAINT "FK_77590fb6526c7475868b8f25c8b"`);
        await queryRunner.query(`ALTER TABLE "Observation" DROP CONSTRAINT "FK_bdb021a8983d56226c2ad95cf3e"`);
        await queryRunner.query(`ALTER TABLE "Observation" DROP CONSTRAINT "FK_2d52cc589c1b69b1423947d993d"`);
        await queryRunner.query(`ALTER TABLE "Fungi" DROP CONSTRAINT "FK_cc000951fddd2be6eb0c35c3f3b"`);
        await queryRunner.query(`ALTER TABLE "Fungi" DROP CONSTRAINT "FK_7e681dd505dd4e9834fdc1f8a32"`);
        await queryRunner.query(`ALTER TABLE "Species" DROP CONSTRAINT "FK_cb3b94fae5b15c8971a1abb1645"`);
        await queryRunner.query(`DROP TABLE "UserHerbarium"`);
        await queryRunner.query(`DROP TABLE "Club"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Herbarium"`);
        await queryRunner.query(`DROP TABLE "Observation"`);
        await queryRunner.query(`DROP TABLE "Location"`);
        await queryRunner.query(`DROP TABLE "Fungi"`);
        await queryRunner.query(`DROP TABLE "Species"`);
        await queryRunner.query(`DROP TABLE "Genus"`);
        await queryRunner.query(`DROP TABLE "Edibility"`);
    }

}
