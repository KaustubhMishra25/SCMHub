import anthropic
from dotenv import load_dotenv
import os

load_dotenv()

client = anthropic.Anthropic(api_key=os.environ.get('CLAUDE_API_KEY'))

def get_response_claude(prompt, userData, sampleQueries):
    response = client.messages.create(
        model="claude-2.1",
        max_tokens=1024,
        system=sampleQueries+"\n"+userData,
        messages=[
            {"role": "user", "content": prompt} # <-- user prompt
        ]
    )

    return response.content[0].text