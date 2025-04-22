from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)

# Ganti ini dengan info database MySQL AWS kamu
db = pymysql.connect(
    host="ppib-mysql8.cvp0g1n8cmrx.ap-southeast-1.rds.amazonaws.com",
    user="",
    password="",
    database=""
)

@app.route('/')
def index():
    return "API Flask + MySQL jalan!"

@app.route('/ast_user', methods=['GET'])
def get_users():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM ast_user")
    rows = cursor.fetchall()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
