import { Client } from '@elastic/elasticsearch';
import { env } from './env';

const node = env.ELASTICSEARCH_NODE;

export const esClient = new Client({
  node,
});

import { logger } from './logger';

// Helper to check Elasticsearch connection
export const checkEsConnection = async (): Promise<boolean> => {
  try {
    const health = await esClient.ping();
    return health;
  } catch (error) {
    logger.error({ err: error }, 'Elasticsearch Connection Error');
    return false;
  }
};
