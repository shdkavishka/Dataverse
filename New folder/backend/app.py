from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS

app = Flask(__name__)   # Create a Flask application instance
CORS(app)               # Enable CORS for the Flask app

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
     # Extract data from the request JSON
    text = request.json['text']
    thumb = request.json['thumb']
    submit = request.json['submit']
    try:
        with connection.cursor() as cursor:
            if submit == 'submit':
                if thumb == 'Thumbup':  # Corrected from 'thumbup' to 'Thumbup'
                    sql = "INSERT INTO feedback (react,feedback) VALUES (%s,%s)"
                    cursor.execute(sql, ('Good',text))
                if thumb == 'Thumbdown':  # Corrected from 'thumbdown' to 'Thumbdown'
                    sql = "INSERT INTO feedback (react,feedback) VALUES (%s,%s)"
                    cursor.execute(sql, ('Bad',text))
            
            connection.commit()         # Commit the transaction to the database

        return jsonify({'message': 'Data sent successfully'})   # Return a success message as JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # If an exception occurs, return an error message as JSON with status code 500

if __name__ == '__main__':  
    app.run(debug=True)         # Run the Flask application in debug mode if this script is executed directly