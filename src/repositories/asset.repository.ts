import { In } from 'typeorm';
import { AppDataSource } from '../config/db';
import { AssetEntity } from '../entities/asset.entity';

export class AssetRepository {
  private getRepository() {
    return AppDataSource.getRepository(AssetEntity);
  }

  /**
   * Finds assets based on optional department and/or risk level.
   */
  async findByDepartmentAndRisk(department?: string, risk?: string): Promise<AssetEntity[]> {
    const repo = this.getRepository();
    const where: Partial<AssetEntity> = {};

    if (department) {
      where.department_owner = department;
    }

    if (risk) {
      where.risk_level = risk;
    }

    return repo.find({ where });
  }

  /**
   * Finds assets by their local IP address.
   */
  async findByIps(ips: string[]): Promise<AssetEntity[]> {
    if (ips.length === 0) return [];
    
    const repo = this.getRepository();
    return repo.find({
      where: {
        host_identifier_local: In(ips),
      },
    });
  }
}
