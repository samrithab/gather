CREATE TABLE hangouts (
    id UUID PRIMARY KEY,
    organizer_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hangouts_organizer
        FOREIGN KEY (organizer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_hangout_end_after_start
        CHECK (end_time IS NULL OR end_time > start_time)
);

CREATE INDEX idx_hangouts_organizer_id
    ON hangouts(organizer_id);

CREATE INDEX idx_hangouts_start_time
    ON hangouts(start_time);