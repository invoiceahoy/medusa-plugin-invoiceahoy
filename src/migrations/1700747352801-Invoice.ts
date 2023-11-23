import { MigrationInterface, QueryRunner } from "typeorm"

export class Invoice1700747352801 implements MigrationInterface {
    name = "Invoice1700747352801"
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "invoice" (
          "id" character varying NOT NULL, 
          "external_id" character varying NOT NULL, 
          "order_id" character varying NOT NULL, 
          "doc_number" character varying NOT NULL, 
          "url" character varying, 
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
           CONSTRAINT "PK_1700747352801" PRIMARY KEY ("id"))
           `
        )
        await queryRunner.query(
          `ALTER TABLE "invoice" ADD CONSTRAINT "FK_1700747352801" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_1700747352801"`)
        await queryRunner.query(`DROP TABLE "invoice"`)
    }

}
