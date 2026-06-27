import { AppDataSource } from '../config/db';
import { ipSeeder } from './seeds/ip.seeder';
import { assetSeeder } from './seeds/asset.seeder';

async function seed() {
  const args = process.argv.slice(2);
  const target = args[0]?.toLowerCase() || 'all';

  const availableSeeders = [ipSeeder, assetSeeder];
  const seederNames = availableSeeders.map(s => s.name);

  if (target !== 'all' && !seederNames.includes(target)) {
    console.error(`Invalid seeder target: "${target}"`);
    console.error(`Available options: all, ${seederNames.join(', ')}`);
    process.exit(1);
  }

  console.log('Connecting to the database for seeding...');
  await AppDataSource.initialize();
  console.log('Database connected successfully.');

  try {
    if (target === 'all') {
      console.log('Running all seeders...');
      for (const seeder of availableSeeders) {
        await seeder.run(AppDataSource);
      }
    } else {
      const selected = availableSeeders.find(s => s.name === target);
      if (selected) {
        console.log(`Running seeder: "${selected.name}"...`);
        await selected.run(AppDataSource);
      }
    }
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding execution:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
