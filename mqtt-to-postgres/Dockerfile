FROM python:3.9-slim

WORKDIR /app

# Install required packages
RUN pip install --no-cache-dir paho-mqtt psycopg2-binary

# Copy the script
COPY mqtt_aircraft_subscriber.py .

# Run the script
CMD ["python", "mqtt_aircraft_subscriber.py"]
