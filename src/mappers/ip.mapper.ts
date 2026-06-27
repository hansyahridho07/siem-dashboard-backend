import { HighlightedIpEntity } from '../entities/ip.entity';
import { HighlightedIpResponseDto } from '../dto/response/highlighted-ip.response.dto';

export class IpMapper {
  /**
   * Transforms raw PostgreSQL HighlightedIpEntity to HighlightedIpResponseDto format.
   */
  static toResponseDto(entity: HighlightedIpEntity): HighlightedIpResponseDto {
    return {
      id: entity.id,
      ip_address: entity.ip_address,
      reason: entity.reason || null,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  /**
   * Transforms list of HighlightedIpEntity.
   */
  static toResponseDtoList(entities: HighlightedIpEntity[]): HighlightedIpResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}
