CREATE TABLE internal_infrastructure_assets (
    id SERIAL PRIMARY KEY,
    asset_name VARCHAR NOT NULL,
    host_identifier_local VARCHAR NOT NULL,
    department_owner VARCHAR NOT NULL,
    risk_level VARCHAR NOT NULL
);

INSERT INTO internal_infrastructure_assets (asset_name, host_identifier_local, department_owner, risk_level) VALUES
('Server Core Finance', '192.168.10.25', 'Finance', 'High'),
('Database HRIS', '192.168.10.30', 'HR', 'Medium'),
('Web App Client Portal', '192.168.20.50', 'IT Operation', 'High'),
('Workstation Admin', '192.168.50.11', 'Finance', 'Low'),
('Fileserver R&D', '192.168.30.5', 'Research', 'Medium');