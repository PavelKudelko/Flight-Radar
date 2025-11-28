CREATE TABLE aircraft_positions (
	id SERIAL PRIMARY KEY,
	icao TEXT,
	flight TEXT,
	latitude FLOAT,
	longitude FLOAT,
	altitude FLOAT,
	speed FLOAT,
	heading FLOAT,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_icao_timestamp ON aircraft_positions (icao, timestamp DESC);
CREATE INDEX idx_timestamp ON aircraft_positions (timestamp DESC);
CREATE INDEX idx_location ON aircraft_positions (latitude, longitude);
