import { AssetRepository } from '../repositories/asset.repository';
import { AlertRepository } from '../repositories/alert.repository';
import { AlertMapper } from '../mappers/alert.mapper';
import { GetFilteredAlertsRequest } from '../dto/request/alert-query.request.dto';
import { AlertResponseDto } from '../dto/response/alert.response.dto';
import { TopTargetedResponseDto } from '../dto/response/top-targeted.response.dto';

export class AlertService {
  private assetRepository = new AssetRepository();
  private alertRepository = new AlertRepository();

  /**
   * Orchestrates filtering and retrieval of alerts, enriched by assets.
   */
  async getFilteredAlerts(dto: GetFilteredAlertsRequest): Promise<{
    meta: {
      total_data: number;
      page: number;
      limit: number;
    };
    data: AlertResponseDto[];
  }> {
    const { department, risk, page, limit } = dto;
    let targetIps: string[] | undefined = undefined;

    // 2. If department or risk filters are active, fetch matching assets first
    if (department || risk) {
      const assets = await this.assetRepository.findByDepartmentAndRisk(department, risk);
      
      // If we are filtering, but no assets matched, we shouldn't show any alerts
      if (assets.length === 0) {
        return {
          meta: {
            total_data: 0,
            page,
            limit,
          },
          data: [],
        };
      }

      targetIps = assets.map(asset => asset.host_identifier_local);
    }

    // 3. Retrieve alert logs from Elasticsearch
    const { total, hits } = await this.alertRepository.searchAlerts(targetIps, page, limit);

    // 4. Map logs to desired client format DTO
    const mappedAlerts = AlertMapper.toResponseDtoList(hits);

    return {
      meta: {
        total_data: total,
        page,
        limit,
      },
      data: mappedAlerts,
    };
  }

  /**
   * Orchestrates retrieving and enriching top targeted assets.
   */
  async getTopTargetedAssets(limit: number = 5): Promise<{
    meta: {
      total_data: number;
    };
    data: TopTargetedResponseDto[];
  }> {
    // 1. Get top targeted IPs from Elasticsearch
    const topIps = await this.alertRepository.getTopTargetedIps(limit);
    if (topIps.length === 0) {
      return {
        meta: {
          total_data: 0,
        },
        data: [],
      };
    }

    // 2. Fetch asset details for those IPs from PostgreSQL
    const ips = topIps.map(item => item.ip);
    const assets = await this.assetRepository.findByIps(ips);

    // Create an asset lookup map by local host identifier for fast access
    const assetMap = new Map(assets.map(asset => [asset.host_identifier_local, asset]));

    // 3. Map/Enrich the top targeted assets DTOs
    const list = topIps.map(item => {
      const asset = assetMap.get(item.ip);
      return AlertMapper.toEnrichedAggregationDto(item.ip, item.count, asset);
    });

    return {
      meta: {
        total_data: list.length,
      },
      data: list,
    };
  }
}
