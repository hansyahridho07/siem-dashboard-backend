#!/bin/sh

echo "Menunggu Elasticsearch siap..."
until curl -s http://elasticsearch:9200/_cluster/health | grep -q '"status":"green"\|"status":"yellow"'; do
    sleep 2
done

echo "Elasticsearch siap! Membuat index security-alerts..."

curl -X PUT "http://elasticsearch:9200/security-alerts" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "src_ip": { "type": "ip" },
      "network_target_ip": { "type": "ip" },
      "signature_name": { "type": "keyword" },
      "severity": { "type": "integer" }
    }
  }
}'

echo "Memasukkan dummy log alert (24 Records)..."

curl -X POST "http://elasticsearch:9200/security-alerts/_bulk" -H 'Content-Type: application/json' -d'
{ "index":{} }
{ "timestamp": "2026-06-01T10:01:00Z", "src_ip": "185.220.101.5", "network_target_ip": "192.168.20.50", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T10:13:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.20.50", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T10:27:00Z", "src_ip": "8.8.8.8", "network_target_ip": "192.168.20.50", "signature_name": "COMMUNITY SQL Injection Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T10:38:00Z", "src_ip": "45.95.168.2", "network_target_ip": "192.168.30.5", "signature_name": "ET SCAN Potential SSH Scan", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T10:50:00Z", "src_ip": "185.220.101.5", "network_target_ip": "192.168.20.50", "signature_name": "MALWARE-OTHER Win.Trojan.Generic", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T11:04:00Z", "src_ip": "45.95.168.2", "network_target_ip": "192.168.10.25", "signature_name": "INDICATOR-SCAN PING BSD", "severity": 3 }
{ "index":{} }
{ "timestamp": "2026-06-01T11:14:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.30.5", "signature_name": "ET SCAN Potential SSH Scan", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T11:26:00Z", "src_ip": "45.95.168.2", "network_target_ip": "192.168.50.11", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T11:41:00Z", "src_ip": "8.8.8.8", "network_target_ip": "192.168.10.25", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T11:53:00Z", "src_ip": "10.0.0.9", "network_target_ip": "192.168.10.25", "signature_name": "PROTOCOL-SNMP Request Generic Attempt", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T12:01:00Z", "src_ip": "10.0.0.5", "network_target_ip": "192.168.10.25", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T12:14:00Z", "src_ip": "8.8.8.8", "network_target_ip": "192.168.20.50", "signature_name": "INDICATOR-SCAN PING BSD", "severity": 3 }
{ "index":{} }
{ "timestamp": "2026-06-01T12:26:00Z", "src_ip": "10.0.0.5", "network_target_ip": "192.168.10.30", "signature_name": "ET SCAN Potential SSH Scan", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T12:38:00Z", "src_ip": "185.220.101.5", "network_target_ip": "192.168.10.25", "signature_name": "ET SCAN Potential SSH Scan", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T12:53:00Z", "src_ip": "45.95.168.2", "network_target_ip": "192.168.10.30", "signature_name": "COMMUNITY SQL Injection Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T13:02:00Z", "src_ip": "10.0.0.9", "network_target_ip": "192.168.50.11", "signature_name": "PROTOCOL-SNMP Request Generic Attempt", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T13:15:00Z", "src_ip": "10.0.0.5", "network_target_ip": "192.168.20.50", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T13:25:00Z", "src_ip": "172.16.5.4", "network_target_ip": "192.168.10.25", "signature_name": "ET SCAN Potential SSH Scan", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T13:38:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.20.50", "signature_name": "PROTOCOL-SNMP Request Generic Attempt", "severity": 2 }
{ "index":{} }
{ "timestamp": "2026-06-01T13:51:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.50.11", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T14:05:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.20.50", "signature_name": "INDICATOR-SCAN PING BSD", "severity": 3 }
{ "index":{} }
{ "timestamp": "2026-06-01T14:16:00Z", "src_ip": "185.220.101.5", "network_target_ip": "192.168.20.50", "signature_name": "INDICATOR-SCAN PING BSD", "severity": 3 }
{ "index":{} }
{ "timestamp": "2026-06-01T14:28:00Z", "src_ip": "8.8.8.8", "network_target_ip": "192.168.10.30", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
{ "index":{} }
{ "timestamp": "2026-06-01T14:41:00Z", "src_ip": "192.168.1.100", "network_target_ip": "192.168.10.25", "signature_name": "BROWSER-CHROME CVE-2023-3079 Exploit Attempt", "severity": 1 }
'

echo "Setup data selesai!"