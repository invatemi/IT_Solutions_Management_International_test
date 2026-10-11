#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/d47dfb69ab664150f7fa182b236784810860e48dab50c5f6849c5a925bcc0534/contract';
import endContract from '../../snapshots/d47dfb69ab664150f7fa182b236784810860e48dab50c5f6849c5a925bcc0534/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Achievement',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('experienceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Experience',
        columns: [
          col('company', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endDate', 'date', { codecRef: { codecId: 'pg/date-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('position', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startDate', 'date', { notNull: true, codecRef: { codecId: 'pg/date-string@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Link',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Profile',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Project',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Skill',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profileId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Achievement',
        index: 'Achievement_experienceId_idx_d593f48a',
        columns: ['experienceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Experience',
        index: 'Experience_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Link',
        index: 'Link_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Skill',
        index: 'Skill_profileId_idx_d9cdfcaf',
        columns: ['profileId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Achievement',
        foreignKey: {
          name: 'Achievement_experienceId_fkey',
          columns: ['experienceId'],
          references: { schema: 'public', table: 'Experience', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Experience',
        foreignKey: {
          name: 'Experience_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'Profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Link',
        foreignKey: {
          name: 'Link_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'Profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Project',
        foreignKey: {
          name: 'Project_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'Profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Skill',
        foreignKey: {
          name: 'Skill_profileId_fkey',
          columns: ['profileId'],
          references: { schema: 'public', table: 'Profile', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
