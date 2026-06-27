export interface AlertResponseDto {
  timestamp: string;
  source_ip: string;
  target_ip: string;
  alert_name: string;
  severity: number;
}
