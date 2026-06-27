import { Request } from 'express';
import { IpService } from '../services/ip.service';
import { Success } from '../decorators/response.decorator';
import { CreateHighlightedIpSchema, UpdateHighlightedIpSchema, ParamIdSchema } from '../dto/request/highlighted-ip.request.dto';
import { BadRequestError } from '../errors/app.error';

export class IpController {
  private ipService = new IpService();

  constructor() {
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getMonitoring = this.getMonitoring.bind(this);
  }

  /**
   * GET /api/highlighted-ips
   */
  @Success('Successfully retrieved highlighted IP list')
  async getAll() {
    return this.ipService.getAllHighlightedIps();
  }

  /**
   * POST /api/highlighted-ips
   */
  @Success('Successfully added highlighted IP', 201)
  async create(req: Request) {
    const parsed = CreateHighlightedIpSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError('Invalid request payload', parsed.error.format());
    }
    return this.ipService.addHighlightedIp(parsed.data);
  }

  /**
   * PUT /api/highlighted-ips/:id
   */
  @Success('Successfully updated highlighted IP')
  async update(req: Request) {
    const parsedId = ParamIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      throw new BadRequestError('Invalid ID parameter format', parsedId.error.format());
    }
    const parsedBody = UpdateHighlightedIpSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new BadRequestError('Invalid request payload', parsedBody.error.format());
    }
    return this.ipService.updateHighlightedIp(parsedId.data, parsedBody.data);
  }

  /**
   * DELETE /api/highlighted-ips/:id
   */
  @Success('Successfully deleted highlighted IP')
  async delete(req: Request) {
    const parsedId = ParamIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      throw new BadRequestError('Invalid ID parameter format', parsedId.error.format());
    }
    return this.ipService.deleteHighlightedIp(parsedId.data);
  }

  /**
   * Task 3 Part C: GET /api/alerts/monitoring
   */
  @Success('Successfully retrieved data')
  async getMonitoring() {
    return this.ipService.getMonitoringAlerts();
  }
}
