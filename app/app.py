from flask import Flask
import os
import mysql.connector
import requests
import logging

app = Flask(__name__)

log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'flask.log')
logging.basicConfig(filename=log_file, level=logging.INFO)

@app.route('/')
def index():
    try:
        # Hubungkan ke database
        db = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        cursor = db.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        db.close()

        # Ambil pesan dari backend
        response = requests.get("http://backend:5000/api/message")
        backend_msg = response.json().get("message", "Tidak ada pesan")

        message = f"Pesan dari backend: {backend_msg}<br>MySQL version: {version[0]}"
        logging.info(message)
        return message

    except Exception as e:
        error_msg = f"Terjadi kesalahan: {e}"
        logging.error(error_msg)
        return error_msg

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
