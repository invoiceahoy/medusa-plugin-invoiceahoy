import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn,} from "typeorm"
import {generateEntityId} from "@medusajs/medusa/dist/utils"

@Entity()
export class Invoice {

  @PrimaryColumn({ type: "varchar" })
  id: string

  @Column({ type: "varchar" })
  external_id: string

  @Column({ type: "varchar" })
  doc_number: string | null

  @Column({ type: "varchar" })
  order_id: string

  @Column({ type: "varchar" })
  url: string | null

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "invoice")
  }
}