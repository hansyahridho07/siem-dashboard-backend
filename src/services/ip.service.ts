import { IpRepository } from '../repositories/ip.repository';
import { AlertRepository } from '../repositories/alert.repository';
import { IpMapper } from '../mappers/ip.mapper';
import { AlertMapper } from '../mappers/alert.mapper';
import { NotFoundError, ConflictError } from '../errors/app.error';
import { CreateHighlightedIpRequest, UpdateHighlightedIpRequest } from '../dto/request/highlighted-ip.request.dto';
import { HighlightedIpResponseDto } from '../dto/response/highlighted-ip.response.dto';
import { AlertResponseDto } from '../dto/response/alert.response.dto';

export class IpService {
  private ipRepository = new IpRepository();
  private alertRepository = new AlertRepository();

  /**
   * Get all highlighted IPs.
   */
  async getAllHighlightedIps(): Promise<HighlightedIpResponseDto[]> {
    const list = await this.ipRepository.findAll();
    return IpMapper.toResponseDtoList(list);
  }

  /**
   * Add a new highlighted IP.
   */
  async addHighlightedIp(dto: CreateHighlightedIpRequest): Promise<HighlightedIpResponseDto> {
    const { ip_address, reason } = dto;

    // Check if IP already highlighted
    const existing = await this.ipRepository.findByIpAddress(ip_address);
    if (existing) {
      throw new ConflictError(`IP address ${ip_address} is already highlighted`);
    }

    const created = await this.ipRepository.create(ip_address, reason);
    return IpMapper.toResponseDto(created);
  }

  /**
   * Update an existing highlighted IP.
   */
  async updateHighlightedIp(id: number, dto: UpdateHighlightedIpRequest): Promise<HighlightedIpResponseDto> {
    const { ip_address, reason } = dto;

    const existing = await this.ipRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Highlighted IP with ID ${id} not found`);
    }

    // Check if another IP is using this address
    const conflict = await this.ipRepository.findByIpAddress(ip_address);
    if (conflict && conflict.id !== id) {
      throw new ConflictError(`IP address ${ip_address} is already registered under ID ${conflict.id}`);
    }

    const updated = await this.ipRepository.update(id, ip_address, reason);
    if (!updated) {
      throw new NotFoundError(`Highlighted IP with ID ${id} not found during update`);
    }
    return IpMapper.toResponseDto(updated);
  }

  /**
   * Delete a highlighted IP.
   */
  async deleteHighlightedIp(id: number): Promise<boolean> {
    const success = await this.ipRepository.delete(id);
    if (!success) {
      throw new NotFoundError(`Highlighted IP with ID ${id} not found`);
    }
    return true;
  }

  /**
   * Monitoring: Get alert logs where source IP matches any highlighted IP.
   */
  async getMonitoringAlerts(): Promise<{
    meta: {
      total_data: number;
    };
    data: AlertResponseDto[];
  }> {
    // 1. Get all highlighted IPs
    const highlightedIps = await this.ipRepository.findAll();
    if (highlightedIps.length === 0) {
      return {
        meta: {
          total_data: 0,
        },
        data: [],
      };
    }

    // 2. Extract IP strings
    const ipStrings = highlightedIps.map(item => item.ip_address);

    // 3. Search Elasticsearch alerts where src_ip matches these IPs
    const alerts = await this.alertRepository.searchAlertsBySourceIps(ipStrings);

    // 4. Map and return DTO response list
    const mapped = AlertMapper.toResponseDtoList(alerts);
    
    return {
      meta: {
        total_data: mapped.length,
      },
      data: mapped,
    };
  }
}
