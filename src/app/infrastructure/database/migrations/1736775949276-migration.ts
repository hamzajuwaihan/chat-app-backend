import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1736775949276 implements MigrationInterface {
  name = 'Migration1736775949276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "emoji" character varying, "unicode" character varying, "image" character varying, "dial_code" character varying, CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name"), CONSTRAINT "UQ_b47cbb5311bad9c9ae17b8c1eda" UNIQUE ("code"), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profiles_gender_enum" AS ENUM('Male', 'Female', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "profile_picture" character varying, "lastActive" TIMESTAMP, "settings" json, "privacySettings" json DEFAULT '{"allowPrivateMessages":"all","allowConversationRequests":true,"mediaReception":"all","invisibleMode":false}', "status" "public"."profiles_status_enum" DEFAULT 'available', "gender" "public"."profiles_gender_enum" DEFAULT 'Other', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "countryId" uuid, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255), "password_hash" text, "nickname" character varying(50) NOT NULL, "is_guest" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_feature_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permissionType" "public"."user_feature_permissions_permissiontype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "allowed_user_id" uuid, CONSTRAINT "PK_ce2f7c59e27e91154ae1dffc84a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "max_users" integer NOT NULL DEFAULT '50', "theme_settings" json, "visibility" "public"."rooms_visibility_enum" NOT NULL DEFAULT 'public', "password_protected" boolean NOT NULL DEFAULT false, "owner_type" "public"."rooms_owner_type_enum" NOT NULL, "owner_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "country_id" uuid, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."room_memberships_role_enum" NOT NULL DEFAULT 'member', "banned_until" TIMESTAMP, "muted_until" TIMESTAMP, "reason" text, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "room_id" uuid, "user_id" uuid, CONSTRAINT "PK_4e7bdab6801b248411afc84b00f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "message_type" "public"."room_messages_message_type_enum" NOT NULL DEFAULT 'text', "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bd83c95b3d0ad3931d6c1687ee1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "text" text NOT NULL, "message_type" "public"."private_messages_message_type_enum" NOT NULL DEFAULT 'text', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bf7cc91ba0b17389d76f7ad2a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blocked_users" ("blocker_id" uuid NOT NULL, "blocked_id" uuid NOT NULL, CONSTRAINT "PK_b67ed0acca994276b01f2688437" PRIMARY KEY ("blocker_id", "blocked_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e543cda1c6f5aa2034fd2c105" ON "blocked_users" ("blocker_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f515c19546d94b927811b9b3f1" ON "blocked_users" ("blocked_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_41f1fa9217a69dccd306bd3995a" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feature_permissions" ADD CONSTRAINT "FK_ec0df1e14f470d661a81c8910d5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feature_permissions" ADD CONSTRAINT "FK_5571e48bab8f18897c9ec408c1b" FOREIGN KEY ("allowed_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_3ef3bcea50af2dffe5a49407035" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_memberships" ADD CONSTRAINT "FK_f32bd199eb196f84d0893a3054d" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_memberships" ADD CONSTRAINT "FK_69395a6306f92243ffda7ea113a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blocked_users" ADD CONSTRAINT "FK_7e543cda1c6f5aa2034fd2c105d" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blocked_users" ADD CONSTRAINT "FK_f515c19546d94b927811b9b3f15" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blocked_users" DROP CONSTRAINT "FK_f515c19546d94b927811b9b3f15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blocked_users" DROP CONSTRAINT "FK_7e543cda1c6f5aa2034fd2c105d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_memberships" DROP CONSTRAINT "FK_69395a6306f92243ffda7ea113a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_memberships" DROP CONSTRAINT "FK_f32bd199eb196f84d0893a3054d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_3ef3bcea50af2dffe5a49407035"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feature_permissions" DROP CONSTRAINT "FK_5571e48bab8f18897c9ec408c1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feature_permissions" DROP CONSTRAINT "FK_ec0df1e14f470d661a81c8910d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_41f1fa9217a69dccd306bd3995a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f515c19546d94b927811b9b3f1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e543cda1c6f5aa2034fd2c105"`,
    );
    await queryRunner.query(`DROP TABLE "blocked_users"`);
    await queryRunner.query(`DROP TABLE "private_messages"`);
    await queryRunner.query(`DROP TABLE "room_messages"`);
    await queryRunner.query(`DROP TABLE "room_memberships"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "user_feature_permissions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TYPE "public"."profiles_gender_enum"`);
    await queryRunner.query(`DROP TABLE "countries"`);
  }
}
