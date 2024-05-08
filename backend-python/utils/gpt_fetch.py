from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key = os.environ.get('OPENAI_API_KEY'))

def get_response_gpt(prompt, userData, sampleQueries):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": sampleQueries+userData+"\n"},
            {"role": "user", "content": prompt}
        ]
    )
    response = completion.choices[0].text.strip()

    return response
