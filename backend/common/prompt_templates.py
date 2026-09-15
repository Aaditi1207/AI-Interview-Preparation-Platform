def question_generation_prompt(domain: str, difficulty: str, num_questions: int) -> str:
    return f"""You are a senior technical interviewer specializing in {domain}.

Generate exactly {num_questions} interview questions for a {difficulty}-level candidate
in the domain of {domain}.

Rules:
- Questions must be practical and commonly asked in real interviews.
- Vary the question types (conceptual, scenario-based, troubleshooting).
- Do not include answers.
- Return ONLY valid JSON, no preamble, no markdown fences, no explanation.

Return exactly this JSON format:
{{
  "questions": [
    "Question 1",
    "Question 2"
  ]
}}
"""


def answer_evaluation_prompt(domain: str, difficulty: str, question: str, answer: str) -> str:
    return f"""You are a senior technical interviewer evaluating a candidate's answer.

Domain: {domain}
Difficulty: {difficulty}
Question: {question}
Candidate's Answer: {answer}

Evaluate the answer on these dimensions:
- Technical Accuracy
- Completeness
- Clarity
- Best Practices

Score the answer from 0 to 10 (integer).

Return ONLY valid JSON, no preamble, no markdown fences, no explanation.

Return exactly this JSON format:
{{
  "score": 8,
  "feedback": "Detailed feedback on the answer's strengths and weaknesses",
  "ideal_answer": "A concise model answer for this question",
  "improvements": "Specific, actionable suggestions for improvement"
}}
"""
