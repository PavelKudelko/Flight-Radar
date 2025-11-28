import json
import paho.mqtt.client as mqtt
import psycopg2
import time
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("mqtt_subscriber")

# Connection to PostgreSQL with proper error handling
logger.info("Trying to connect to PostgreSQL...")
while True:
    try:
        conn = psycopg2.connect(
            dbname="flightradar_data",
            user="XXXX",
            password="XXXX",
            host="postgres",
            port="5432"
        )
        logger.info("Successfully connected to PostgreSQL")
        break
    except psycopg2.OperationalError as e:
        logger.warning(f"Waiting for PostgreSQL, retrying in 2 seconds... Error: {e}")
        time.sleep(2)

db_cursor = conn.cursor()

# Insert test data to check the connection
try:
    db_cursor.execute("INSERT INTO aircraft_positions (flight, latitude, longitude, altitude, speed, heading) VALUES ('TEST', 52.5200, 13.4050, 35000, 900, 270)")
    conn.commit()
    logger.info("Test data insertion successful!")
except Exception as e:
    logger.error(f"Failed to insert test data: {e}")
    conn.rollback()

# Define MQTT callbacks
def on_connect(client, userdata, flags, rc):
    logger.info(f"Connected to MQTT broker with result code {rc}")
    # Re-subscribe in on_connect to handle reconnections
    client.subscribe("aircraft/live")
    logger.info("Subscribed to topic: aircraft/live")

def on_disconnect(client, userdata, rc):
    if rc != 0:
        logger.warning(f"Unexpected disconnection from MQTT broker, code: {rc}")
    else:
        logger.info("Disconnected from MQTT broker")

def on_subscribe(client, userdata, mid, granted_qos):
    logger.info(f"Subscribed with QoS: {granted_qos}")

def on_message(client, userdata, message):
    try:
        payload = message.payload.decode()
        logger.info(f"Received payload: {payload}")

        data = json.loads(payload)
        logger.debug(f"Parsed JSON data: {data}")

        # Insert into DB
        db_cursor.execute("""
            INSERT INTO aircraft_positions (icao, flight, latitude, longitude, altitude, speed, heading, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, to_timestamp(%s))
        """, (
	    data.get("icao"),
            data.get("flight"),
            data.get("lat"),
            data.get("lon"),
            data.get("altitude"),
            data.get("speed"),
            data.get("heading"),
            data.get("timestamp")
        ))
        conn.commit()
        logger.info("Successfully inserted data into PostgreSQL")
    except json.JSONDecodeError as je:
        logger.error(f"JSON parsing error: {je}, Payload: {payload}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        conn.rollback()

# MQTT setup
logger.info("Setting up MQTT client...")
client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
client.on_subscribe = on_subscribe

# Try to connect to MQTT broker with retry logic
max_retries = 5
retry_count = 0
while retry_count < max_retries:
    try:
        logger.info("Attempting to connect to MQTT broker at mosquitto:1883...")
        client.connect("mosquitto", 1883, 60)
        break
    except Exception as e:
        retry_count += 1
        logger.error(f"Failed to connect to MQTT broker (Attempt {retry_count}/{max_retries}): {e}")
        if retry_count >= max_retries:
            logger.critical("Maximum retry attempts reached. Exiting.")
            exit(1)
        time.sleep(5)

# Start the MQTT client loop
try:
    logger.info("Starting MQTT client loop...")
    client.loop_forever()
except KeyboardInterrupt:
    logger.info("Keyboard interrupt received, shutting down...")
    client.disconnect()
    conn.close()
except Exception as e:
    logger.critical(f"Fatal error in main loop: {e}")
    client.disconnect()
    conn.close()
