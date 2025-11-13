-- Create audit_requests table
CREATE TABLE audit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    violations JSONB DEFAULT '[]',
    risk_level VARCHAR(20) DEFAULT 'unknown',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255),
    consent_given BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_audit_requests_status ON audit_requests(status);
CREATE INDEX idx_audit_requests_created_at ON audit_requests(created_at DESC);
CREATE INDEX idx_audit_requests_email ON audit_requests(email);

-- Grant permissions
GRANT ALL ON audit_requests TO authenticated;
GRANT SELECT ON audit_requests TO anon;