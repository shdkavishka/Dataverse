from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection configuration
host = 'localhost'
user = 'root'
password = 'Tash10.9'
database = 'feedback'
connection = pymysql.connect(host=host,
                             user=user,
                             password=password,
                             database=database,
                             cursorclass=pymysql.cursors.DictCursor)

@app.route('/send-data', methods=['POST'])
def send_data():
    data = request.json
    text = data.get('text', '')
    thumb = data.get('thumb', '')
    try:
        with connection.cursor() as cursor:
            if thumb == 'Thumbup':  # Corrected from 'thumbup' to 'Thumbup'
                sql = "INSERT INTO feedback (react) VALUES (%s)"
                cursor.execute(sql, ('Good',))
            elif thumb == 'Thumbdown':  # Corrected from 'thumbdown' to 'Thumbdown'
                sql = "INSERT INTO feedback (react) VALUES (%s)"
                cursor.execute(sql, ('Bad',))
            else:
                # Insert text feedback if no thumb feedback
                sql = "INSERT INTO feedback (feedback) VALUES (%s)"
                cursor.execute(sql, (text,))
            connection.commit()
        return jsonify({'message': 'Data sent successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)