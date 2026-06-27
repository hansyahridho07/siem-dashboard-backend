import { esClient } from '../config/elasticsearch';
import { AlertEntity } from '../entities/alert.entity';

export class AlertRepository {
  private readonly indexName = 'security-alerts';

  /**
   * Searches alert logs with optional filters on target IPs and pagination.
   */
  async searchAlerts(
    ips?: string[],
    page: number = 1,
    limit: number = 20
  ): Promise<{ total: number; hits: AlertEntity[] }> {
    const from = (page - 1) * limit;

    const query = (ips && ips.length > 0)
      ? {
          terms: {
            network_target_ip: ips,
          },
        }
      : {
          match_all: {},
        };

    console.log(`[Elasticsearch Search] index="${this.indexName}" from=${from} size=${limit} query=`, JSON.stringify(query, null, 2));

    try {
      const response = await esClient.search<AlertEntity>({
        index: this.indexName,
        from,
        size: limit,
        query,
        sort: [
          { timestamp: { order: 'desc' } }
        ]
      });

      const total = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : (response.hits.total?.value || 0);

      const hits = response.hits.hits
        .map(hit => hit._source)
        .filter((source): source is AlertEntity => !!source);

      return { total, hits };
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      return { total: 0, hits: [] };
    }
  }

  /**
   * Aggregates the top targeted IPs.
   */
  async getTopTargetedIps(size: number = 5): Promise<{ ip: string; count: number }[]> {
    console.log(`[Elasticsearch Aggregation] index="${this.indexName}" size=0 aggs=`, JSON.stringify({
      top_ips: {
        terms: {
          field: 'network_target_ip',
          size,
        },
      },
    }, null, 2));

    try {
      const response = await esClient.search({
        index: this.indexName,
        size: 0, // We only want aggregation results
        aggs: {
          top_ips: {
            terms: {
              field: 'network_target_ip',
              size,
            },
          },
        },
      });

      interface AggsBucket {
        key: string;
        doc_count: number;
      }
      const buckets = (response.aggregations?.top_ips as { buckets?: AggsBucket[] })?.buckets || [];
      return buckets.map((bucket: AggsBucket) => ({
        ip: bucket.key,
        count: bucket.doc_count,
      }));
    } catch (error) {
      console.error('Elasticsearch aggregation error:', error);
      return [];
    }
  }

  /**
   * Searches alert logs where the source IP matches any of the given IPs.
   */
  async searchAlertsBySourceIps(srcIps: string[]): Promise<AlertEntity[]> {
    if (srcIps.length === 0) return [];

    console.log(`[Elasticsearch Monitoring Search] index="${this.indexName}" size=10000 query=`, JSON.stringify({
      terms: {
        src_ip: srcIps,
      },
    }, null, 2));

    try {
      const response = await esClient.search<AlertEntity>({
        index: this.indexName,
        size: 10000, // Reasonable max limit for monitoring view
        query: {
          terms: {
            src_ip: srcIps,
          },
        },
        sort: [
          { timestamp: { order: 'desc' } }
        ]
      });

      return response.hits.hits
        .map(hit => hit._source)
        .filter((source): source is AlertEntity => !!source);
    } catch (error) {
      console.error('Elasticsearch monitoring search error:', error);
      return [];
    }
  }
}
