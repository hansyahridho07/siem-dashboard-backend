import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('internal_infrastructure_assets')
export class AssetEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  asset_name!: string;

  @Column({ type: 'varchar' })
  host_identifier_local!: string;

  @Column({ type: 'varchar', name: 'department_owner' })
  department_owner!: string;

  @Column({ type: 'varchar' })
  risk_level!: string;
}
