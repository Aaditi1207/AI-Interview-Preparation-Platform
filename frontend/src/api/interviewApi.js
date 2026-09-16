import axiosClient from './axiosClient.js';

export async function generateQuestions(domain, difficulty, numQuestions) {
  const { data } = await axiosClient.post('/questions', {
    domain,
    difficulty,
    num_questions: numQuestions,
  });
  return data;
}

export async function evaluateAnswers(domain, difficulty, qaPairs) {
  const { data } = await axiosClient.post('/evaluate', {
    domain,
    difficulty,
    qa_pairs: qaPairs,
  });
  return data;
}

export async function saveResults(payload) {
  const { data } = await axiosClient.post('/results', payload);
  return data;
}
