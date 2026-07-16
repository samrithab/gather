CREATE TABLE rsvps (
    id UUID PRIMARY KEY,
    hangout_id UUID NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    status VARCHAR(10) NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rsvps_hangout
        FOREIGN KEY (hangout_id)
        REFERENCES hangouts(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_rsvp_status
        CHECK (status IN ('YES', 'MAYBE', 'NO'))
);

CREATE INDEX idx_rsvps_hangout_id
    ON rsvps(hangout_id);

CREATE INDEX idx_rsvps_hangout_status
    ON rsvps(hangout_id, status);