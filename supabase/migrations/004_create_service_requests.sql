-- Create service_requests table
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    service_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_requests_lead_id ON service_requests(lead_id);
CREATE INDEX idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- Grant permissions
GRANT ALL ON service_requests TO authenticated;
GRANT SELECT ON service_requests TO anon;