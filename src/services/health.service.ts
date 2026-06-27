import { checkPgConnection } from '../config/db';
import { checkEsConnection } from '../config/elasticsearch';
import { HealthResponseDto } from '../dto/response/health.response.dto';

export class HealthService {
  /**
   * Checks connectivity of PostgreSQL and Elasticsearch.
   */
  async checkHealth(): Promise<HealthResponseDto['services']> {
    const isPgConnected = await checkPgConnection();
    const isEsConnected = await checkEsConnection();

    return {
      postgres: isPgConnected ? 'up' : 'down',
      elasticsearch: isEsConnected ? 'up' : 'down',
    };
  }
}
