import { AppDataSource } from '../config/db';
import { HighlightedIpEntity } from '../entities/ip.entity';

export class IpRepository {
  private getRepository() {
    return AppDataSource.getRepository(HighlightedIpEntity);
  }

  /**
   * Find all highlighted IPs.
   */
  async findAll(): Promise<HighlightedIpEntity[]> {
    const repo = this.getRepository();
    return repo.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * Find a highlighted IP by ID.
   */
  async findById(id: number): Promise<HighlightedIpEntity | null> {
    const repo = this.getRepository();
    return repo.findOneBy({ id });
  }

  /**
   * Find a highlighted IP by its IP address string.
   */
  async findByIpAddress(ipAddress: string): Promise<HighlightedIpEntity | null> {
    const repo = this.getRepository();
    return repo.findOneBy({ ip_address: ipAddress });
  }

  /**
   * Create a new highlighted IP record.
   */
  async create(ipAddress: string, reason?: string): Promise<HighlightedIpEntity> {
    const repo = this.getRepository();
    const entity = repo.create({
      ip_address: ipAddress,
      reason: reason || undefined,
    });
    return repo.save(entity);
  }

  /**
   * Update an existing highlighted IP record.
   */
  async update(id: number, ipAddress: string, reason?: string): Promise<HighlightedIpEntity | null> {
    const repo = this.getRepository();
    const entity = await repo.findOneBy({ id });
    if (!entity) return null;

    entity.ip_address = ipAddress;
    entity.reason = reason || undefined;
    
    return repo.save(entity);
  }

  /**
   * Delete a highlighted IP record.
   */
  async delete(id: number): Promise<boolean> {
    const repo = this.getRepository();
    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
