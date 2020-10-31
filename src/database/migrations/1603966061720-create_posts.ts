import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createPosts1603966061720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "integer",
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "integer",
          },
          {
            name: "photo_path",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "likes",
            type: "integer",
            default: 0,
          },
        ],
        foreignKeys: [
          {
            name: "PostUser",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("posts");
  }
}
