import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createComments1604080121399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "comments",
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
            name: "content",
            type: "varchar",
          },
          {
            name: "post_id",
            type: "integer",
          },
          {
            name: "user_id",
            type: "integer",
          },
        ],
        foreignKeys: [
          {
            name: "CommentPost",
            columnNames: ["post_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "posts",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          {
            name: "CommentUser",
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
    await queryRunner.dropTable("comments");
  }
}
