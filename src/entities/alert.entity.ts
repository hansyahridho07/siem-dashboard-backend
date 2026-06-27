export interface AlertEntity {
  timestamp: string; // date format (ISO 8601)
  src_ip: string; // ip address
  network_target_ip: string; // ip address
  signature_name: string; // keyword
  severity: number; // integer
}
