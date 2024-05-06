import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.0-pro')

def get_response_gemini(prompt, userData):
    messages = [
        {
            'role':'user',
            'parts': ["You are the best business advisor, that gives advice on SCM related queries. First here is the business data: \n",userData,"\n",prompt]
        }
    ]
    response = model.generate_content(contents=messages)
    return response.text