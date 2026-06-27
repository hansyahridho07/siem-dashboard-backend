import { AlertEntity } from '../entities/alert.entity';
import { AssetEntity } from '../entities/asset.entity';
import { AlertResponseDto } from '../dto/response/alert.response.dto';
import { TopTargetedResponseDto } from '../dto/response/top-targeted.response.dto';

export class AlertMapper {
  /**
   * Transforms raw Elasticsearch AlertEntity to client response format DTO.
   */
  static toResponseDto(alert: AlertEntity): AlertResponseDto {
    return {
      timestamp: alert.timestamp,
      source_ip: alert.src_ip,
      target_ip: alert.network_target_ip,
      alert_name: alert.signature_name,
      severity: alert.severity,
    };
  }

  /**
   * Transforms list of AlertEntity.
   */
  static toResponseDtoList(alerts: AlertEntity[]): AlertResponseDto[] {
    return alerts.map(alert => this.toResponseDto(alert));
  }

  /**
   * Merges Elasticsearch aggregate count with PostgreSQL asset entity to TopTargetedResponseDto.
   */
  static toEnrichedAggregationDto(ip: string, count: number, asset?: AssetEntity): TopTargetedResponseDto {
    return {
      target_ip: ip,
      total_attacks: count,
      asset_name: asset ? asset.asset_name : 'Unknown Asset',
      department: asset ? asset.department_owner : 'Unknown Department',
    };
  }
}
