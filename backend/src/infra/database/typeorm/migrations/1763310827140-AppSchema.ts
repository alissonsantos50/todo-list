import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppSchema1763310827140 implements MigrationInterface {
  name = 'AppSchema1763310827140';
  // transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('todo_app', true);
    await queryRunner.query(
      `CREATE TABLE "todo_app"."tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "finished" boolean NOT NULL DEFAULT false, "user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo_app"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todo_app"."users"`);
    await queryRunner.query(`DROP TABLE "todo_app"."tasks"`);
  }
}
