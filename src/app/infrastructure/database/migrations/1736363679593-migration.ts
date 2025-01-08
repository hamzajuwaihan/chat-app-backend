import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736363679593 implements MigrationInterface {
    name = 'Migration1736363679593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "emoji" character varying, "unicode" character varying, "image" character varying, "dial_code" character varying, CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name"), CONSTRAINT "UQ_b47cbb5311bad9c9ae17b8c1eda" UNIQUE ("code"), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255), "password_hash" text, "nickname" character varying(50) NOT NULL, "is_guest" boolean NOT NULL DEFAULT true, "expires_at" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "profile_picture" character varying, "lastActive" TIMESTAMP, "settings" json, "privacySettings" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "countryId" uuid, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blocked_users" ("blocker_id" uuid NOT NULL, "blocked_id" uuid NOT NULL, CONSTRAINT "PK_b67ed0acca994276b01f2688437" PRIMARY KEY ("blocker_id", "blocked_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7e543cda1c6f5aa2034fd2c105" ON "blocked_users" ("blocker_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f515c19546d94b927811b9b3f1" ON "blocked_users" ("blocked_id") `);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_41f1fa9217a69dccd306bd3995a" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blocked_users" ADD CONSTRAINT "FK_7e543cda1c6f5aa2034fd2c105d" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blocked_users" ADD CONSTRAINT "FK_f515c19546d94b927811b9b3f15" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blocked_users" DROP CONSTRAINT "FK_f515c19546d94b927811b9b3f15"`);
        await queryRunner.query(`ALTER TABLE "blocked_users" DROP CONSTRAINT "FK_7e543cda1c6f5aa2034fd2c105d"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_41f1fa9217a69dccd306bd3995a"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f515c19546d94b927811b9b3f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e543cda1c6f5aa2034fd2c105"`);
        await queryRunner.query(`DROP TABLE "blocked_users"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "countries"`);
    }

}
