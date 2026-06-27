import { DataSource } from 'typeorm';
import { HighlightedIpEntity } from '../../entities/ip.entity';

export const ipSeeder = {
  name: 'ips',
  run: async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(HighlightedIpEntity);
    const data = [
      { ip_address: '185.220.101.5', reason: 'Tor exit node suspicious activity' },
      { ip_address: '45.95.168.2', reason: 'Potential SSH scanning activity' },
      { ip_address: '192.168.1.100', reason: 'Internal host scanner' },
    ];

    console.log('Seeding Highlighted IPs...');
    for (const item of data) {
      const existing = await repo.findOneBy({ ip_address: item.ip_address });
      if (existing) {
        console.log(`  -> IP ${item.ip_address} already exists. Skipping.`);
      } else {
        const entity = repo.create(item);
        await repo.save(entity);
        console.log(`  -> Created Highlighted IP: ${item.ip_address}`);
      }
    }
  }
};
