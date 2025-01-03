import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735865238397 implements MigrationInterface {
    name = 'Migration1735865238397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
