export interface HealthResponseDto {
  status: 'healthy' | 'unhealthy';
  services: {
    postgres: 'up' | 'down';
    elasticsearch: 'up' | 'down';
  };
}
