import { Request } from 'express';
import { AlertService } from '../services/alert.service';
import { Success } from '../decorators/response.decorator';
import { GetFilteredAlertsSchema } from '../dto/request/alert-query.request.dto';
import { BadRequestError } from '../errors/app.error';

export class AlertController {
  private alertService = new AlertService();

  constructor() {
    this.getFilteredAlerts = this.getFilteredAlerts.bind(this);
    this.getTopTargetedAssets = this.getTopTargetedAssets.bind(this);
  }

  /**
   * Task 1: GET /api/alerts
   */
  @Success('Successfully fetched alert logs')
  async getFilteredAlerts(req: Request) {
    const parsed = GetFilteredAlertsSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError('Invalid query parameters', parsed.error.format());
    }
    return this.alertService.getFilteredAlerts(parsed.data);
  }

  /**
   * Task 2: GET /api/alerts/top-targeted
   */
  @Success('Successfully fetched top targeted assets')
  async getTopTargetedAssets() {
    return this.alertService.getTopTargetedAssets();
  }
}
