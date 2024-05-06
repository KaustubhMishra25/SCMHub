import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest


nlp = spacy.load("en_core_web_sm")  # Load spaCy model

def _textSummarizer(text, percentage):
    
    doc= nlp(text)
    tokens=[token.text for token in doc]
    freq_of_word=dict()
    
    for word in doc:
        if word.text.lower() not in list(STOP_WORDS):
            if word.text.lower() not in punctuation:
                if word.text not in freq_of_word.keys():
                    freq_of_word[word.text] = 1
                else:
                    freq_of_word[word.text] += 1
                    
    max_freq=max(freq_of_word.values())
    for word in freq_of_word.keys():
        freq_of_word[word]=freq_of_word[word]/max_freq
        
    sent_tokens= [sent for sent in doc.sents]
    sent_scores = dict()
    for sent in sent_tokens:
        for word in sent:
            if word.text.lower() in freq_of_word.keys():
                if sent not in sent_scores.keys():                            
                    sent_scores[sent]=freq_of_word[word.text.lower()]
                else:
                    sent_scores[sent]+=freq_of_word[word.text.lower()]
    
    len_tokens=int(len(sent_tokens)*percentage)
    summary = nlargest(n = len_tokens, iterable = sent_scores,key=sent_scores.get)
    
    final_summary=[word.text for word in summary]
    summary=" ".join(final_summary)    
    return summary


def compare_answers(answer1: str | None = "No answer", answer2: str | None = "No asnwer", answer3: str | None = "No answer", user_question: str | None = "What is life?"):
  """
  This function compares two LLM responses for an SCM question using NLP techniques.

  Args:
      answer1: The first LLM response.
      answer2: The second LLM response.
      answer3: The third LLM response.
      user_question: The user's SCM question.

  Returns:
      A dictionary containing the winner, scores, and summaries of each response.
  """

  if answer1 is None: answer1="No Answer"
  if answer2 is None: answer2="No Answer"
  if answer3 is None: answer3="No Answer"
  if user_question is None: user_question="What is life?"
  # Preprocessing (optional)
  answer1 = answer1.lower().replace("[^a-zA-Z0-9\s]", "")
  answer2 = answer2.lower().replace("[^a-zA-Z0-9\s]", "")
  answer3 = answer3.lower().replace("[^a-zA-Z0-9\s]", "")
  user_question = user_question.lower().replace("[^a-zA-Z0-9\s]", "")

  print(answer1,"\n",answer2,"\n",answer3,"\n",user_question)
  # Keyword Matching Scores
  question_words = user_question.split()
  answer1_score = 0
  answer2_score = 0
  answer3_score = 0

  answer1_summary = _textSummarizer(answer1,0.5)
  answer2_summary = _textSummarizer(answer2,0.5)
  answer3_summary = _textSummarizer(answer3,0.5)

  for word in question_words:
    answer1_score += (answer1.count(word) + answer1_summary.count(word))
    answer2_score += (answer2.count(word) + answer2_summary.count(word))
    answer3_score += (answer3.count(word) + answer3_summary.count(word))

  # Named Entity Recognition (NER)
  doc1 = nlp(answer1)
  doc2 = nlp(answer2)
  doc3 = nlp(answer3)
  question_doc = nlp(user_question)

  answer1_entities = [ent.text for ent in doc1.ents]
  answer2_entities = [ent.text for ent in doc2.ents]
  answer3_entities = [ent.text for ent in doc3.ents]
  question_entities = [ent.text for ent in question_doc.ents]

  entity_match_score1 = sum(entity in answer1_entities for entity in question_entities)
  entity_match_score2 = sum(entity in answer2_entities for entity in question_entities)
  entity_match_score3 = sum(entity in answer3_entities for entity in question_entities)

  # Basic Semantic Role Labeling (SRL) - Focus on Verbs
  answer1_verbs = [token.text for token in doc1 if token.pos_ == "VERB"]
  answer2_verbs = [token.text for token in doc2 if token.pos_ == "VERB"]
  answer3_verbs = [token.text for token in doc3 if token.pos_ == "VERB"]

  verb_match_score1 = sum(verb in question_words for verb in answer1_verbs)
  verb_match_score2 = sum(verb in question_words for verb in answer2_verbs)
  verb_match_score3 = sum(verb in question_words for verb in answer3_verbs)

  # Specificity & Confidence Scores (replace with actual values)
  answer1_specificity = len(answer1.split())
  answer2_specificity = len(answer2.split())
  answer3_specificity = len(answer3.split())

  # Combine Scores
  total_score1 = (answer1_score + entity_match_score1 + verb_match_score1 +
                 (answer1_specificity / 2))
  total_score2 = (answer2_score + entity_match_score2 + verb_match_score2 +
                 (answer2_specificity / 2))
  total_score3 = (answer3_score + entity_match_score3 + verb_match_score3 +
                 (answer3_specificity / 2))

  # Select Winner
  max_score = max(total_score1,total_score2,total_score3)
  winner = answer1
  if max_score == total_score2:
      winner = answer2
  if max_score == total_score3:
      winner = answer3

  return {
      "winner": winner,
      "answer1_score": total_score1,
      "answer2_score": total_score2,
      "answer3_score": total_score3
  }

# Example Usage 

# answer1 = "An Enterprise Resource Planning (ERP) system can help you manage inventory efficiently."
# answer2 = "Safety stock of a specific product like monitors from Acme Corp located in New York is essential to avoid stockouts in your supply chain."
# user_question = "How can I improve inventory management for monitors?"

# result = compare_answers(answer1, answer2, user_question)

# print(result)