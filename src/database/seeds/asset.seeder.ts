import { DataSource } from 'typeorm';
import { AssetEntity } from '../../entities/asset.entity';

export const assetSeeder = {
  name: 'assets',
  run: async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(AssetEntity);
    const data = [
      { asset_name: 'Server Core Finance', host_identifier_local: '192.168.10.25', department_owner: 'Finance', risk_level: 'High' },
      { asset_name: 'Database HRIS', host_identifier_local: '192.168.10.30', department_owner: 'HR', risk_level: 'Medium' },
      { asset_name: 'Web App Client Portal', host_identifier_local: '192.168.20.50', department_owner: 'IT Operation', risk_level: 'High' },
      { asset_name: 'Workstation Admin', host_identifier_local: '192.168.50.11', department_owner: 'Finance', risk_level: 'Low' },
      { asset_name: 'Fileserver R&D', host_identifier_local: '192.168.30.5', department_owner: 'Research', risk_level: 'Medium' },
    ];

    console.log('Seeding Assets...');
    for (const item of data) {
      const existing = await repo.findOneBy({ host_identifier_local: item.host_identifier_local });
      if (existing) {
        console.log(`  -> Asset with IP ${item.host_identifier_local} already exists. Skipping.`);
      } else {
        const entity = repo.create(item);
        await repo.save(entity);
        console.log(`  -> Created Asset: ${item.asset_name} (${item.host_identifier_local})`);
      }
    }
  }
};
