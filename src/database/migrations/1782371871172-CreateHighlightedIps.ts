import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHighlightedIps1782371871172 implements MigrationInterface {
    name = 'CreateHighlightedIps1782371871172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "highlighted_ips" (
                "id" SERIAL NOT NULL,
                "ip_address" character varying(45) NOT NULL,
                "reason" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_highlighted_ips_ip_address" UNIQUE ("ip_address"),
                CONSTRAINT "PK_highlighted_ips_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "highlighted_ips"`);
    }
}
