from flask import Blueprint, request, jsonify
from utils.gpt_fetch import get_response_gpt
from utils.claude_fetch import get_response_claude
from utils.gemini_fetch import get_response_gemini
from utils.judge import compare_answers

ai = Blueprint('ai', __name__)

@ai.route('/ai/get-response/', methods=['POST'])
def fetch_response_and_analyse():
  try:
    user_data = request.json.get('userData')
    query = request.json.get('prompt')
    user_data = str(user_data)
    print(query + "\n" + user_data)
    gpt_response = None 
    claude_response = None 
    gemini_response = None
    try:
      gpt_response = get_response_gpt(query,user_data) # Answer 1
    except Exception as err:
      pass
    print(gpt_response)
    claude_response = get_response_claude(query,user_data) # Answer 2
    print(claude_response)
    gemini_response = get_response_gemini(query,user_data) # Answer 3
    print(gemini_response)
    
    response = compare_answers(
      answer1=gpt_response, 
      answer2=claude_response, 
      answer3=gemini_response, 
      user_question=query
    )
    
    print(response)

    return jsonify({'success': True, 'message': response['winner']}), 201
  except Exception as error:
    # Handle any errors
    print(f"Error fetching response: {error}")
    return jsonify({'success': False, 'message': 'Error fetching response! Please try again.'}), 500
