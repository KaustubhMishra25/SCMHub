import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.0-pro')

def get_response_gemini(prompt, userData, sampleQueries):
    messages = [
        {
            'role':'user',
            'parts': [ sampleQueries, "\n",userData,"\n -----USER QUERY-----", prompt]
        }
    ]
    response = model.generate_content(contents=messages)
    return response.text