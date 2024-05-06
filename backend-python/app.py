from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from routes.auth import auth
from routes.ai import ai 

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

from dotenv import load_dotenv
load_dotenv()



app.register_blueprint(auth)  
app.register_blueprint(ai)

app.config['JSON_AS_DICT'] = True

@app.route('/')
def hello_world():
  return 'Hello from Flask!'

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5001))
  app.run(debug=True, host='0.0.0.0', port=port)
