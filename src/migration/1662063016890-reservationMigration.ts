import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '../TableName';

export class reservationMigration1662063016890 implements MigrationInterface {
  public reservationTable: Table = new Table({
    name: TableName.Reservation,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isGenerated: true,
        generationStrategy: 'increment',
        isPrimary: true,
      },
      {
        name: 'userId',
        type: 'integer',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'bikeId',
        type: 'integer',
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'status',
        type: 'string',
        isNullable: false,
        default: 'active',
      },
      {
        name: 'reservationStartDate',
        type: 'string',
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'reservationEndDate',
        type: 'string',
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'isRated',
        type: 'boolean',
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'rating',
        type: 'integer',
        isNullable: false,
        isUnique: false,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.reservationTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.reservationTable);
  }
}
