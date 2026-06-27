export interface HighlightedIpResponseDto {
  id: number;
  ip_address: string;
  reason: string | null;
  created_at: Date;
  updated_at: Date;
}
