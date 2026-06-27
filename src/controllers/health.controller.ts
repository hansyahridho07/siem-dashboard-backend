import { HealthService } from '../services/health.service';
import { CustomResponse } from '../decorators/response.decorator';

export class HealthController {
  private healthService = new HealthService();

  constructor() {
    this.checkHealth = this.checkHealth.bind(this);
  }

  /**
   * Task 4: GET /health
   */
  @CustomResponse()
  async checkHealth() {
    const services = await this.healthService.checkHealth();
    const isHealthy = services.postgres === 'up' && services.elasticsearch === 'up';
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      services,
      _status: isHealthy ? 200 : 503, // Extractable status code for the decorator
    };
  }
}
