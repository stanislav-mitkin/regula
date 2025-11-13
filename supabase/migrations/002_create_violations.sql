-- Create violations table
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audit_requests(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_violations_audit_id ON violations(audit_id);
CREATE INDEX idx_violations_type ON violations(type);
CREATE INDEX idx_violations_severity ON violations(severity);

-- Grant permissions
GRANT ALL ON violations TO authenticated;
GRANT SELECT ON violations TO anon;