'use client';

import { useCallback, useMemo, useState } from 'react';

type QuestionItem = {
  id: string;
  text?: string;
  domain?: string;
  facet?: number;
  keyed?: 'plus' | 'minus';
};

type AssessmentInfo = {
  name: string;
  id: string;
  shortId: string;
  time: number;
  questionsCount: number;
  language: string;
};

type QuestionsResponse = {
  assessmentId: string;
  userId: string;
  questions: QuestionItem[];
  assessmentInfo: AssessmentInfo;
  status: string;
};

type ValidateAnswersResponse = {
  success: boolean;
  message: string;
  assessmentId: string;
  answersCount: number;
  status: string;
};

type ResultsResponse = {
  assessmentId: string;
  results: {
    overall: Record<string, { score: number; count: number; result: string; average?: number; percentage?: number }>;
    facets: Record<
      string,
      Record<number, { score: number; count: number; result: string; average?: number; percentage?: number }>
    >;
    generatedAt?: string | Date;
    rawScores?: Record<string, { score: number; count: number }>;
  };
  status: string;
  language?: string;
  answersProcessed: number;
};

type StatusResponse = {
  assessmentId: string;
  userId: string;
  status: string;
  message: string;
  apiType: string;
  answersCount?: number;
};

type HistoryResponse = {
  userId?: string;
  message: string;
  apiType: string;
  history: any[];
  note?: string;
};

type LastExchange = {
  method: string;
  url: string;
  requestBody?: any;
  status?: number;
  ok?: boolean;
  durationMs?: number;
  responseBody?: any;
  error?: string;
};

function formatJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ApiTesterPage(): JSX.Element {
  const [baseUrl, setBaseUrl] = useState<string>(
    'https://k3svg4fxvh.execute-api.us-east-1.amazonaws.com/prod'
  );
  const [userId, setUserId] = useState<string>(
    'tester-' + Math.random().toString(36).slice(2, 8)
  );
  const [language, setLanguage] = useState<string>('en');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<
    Record<string, number>
  >({});
  const [lastExchange, setLastExchange] = useState<LastExchange | null>(null);

  const answeredCount = useMemo(
    () => Object.keys(answersByQuestionId).length,
    [answersByQuestionId]
  );

  const recordExchange = useCallback(
    async (
      method: string,
      path: string,
      requestBody?: any
    ): Promise<{ status: number; ok: boolean; body: any }> => {
      const url = `${baseUrl}${path}`;
      const start = performance.now();
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: requestBody ? JSON.stringify(requestBody) : undefined
        });
        let body: any;
        try {
          body = await response.json();
        } catch {
          body = await response.text();
        }
        const durationMs = Math.round(performance.now() - start);
        const exchange: LastExchange = {
          method,
          url,
          requestBody,
          status: response.status,
          ok: response.ok,
          durationMs,
          responseBody: body
        };
        setLastExchange(exchange);
        return { status: response.status, ok: response.ok, body };
      } catch (error: any) {
        const durationMs = Math.round(performance.now() - start);
        const exchange: LastExchange = {
          method,
          url,
          requestBody,
          error: error?.message || 'Network error',
          durationMs
        };
        setLastExchange(exchange);
        throw error;
      }
    },
    [baseUrl]
  );

  const onGetQuestions = useCallback(async () => {
    const { ok, body } = await recordExchange(
      'GET',
      `/assessment/questions?userId=${encodeURIComponent(userId)}&language=${encodeURIComponent(language)}`
    );
    if (ok) {
      const data = body as QuestionsResponse;
      setAssessmentId(data.assessmentId);
      setQuestions(data.questions || []);
      setAnswersByQuestionId({});
    }
  }, [recordExchange, userId, language]);

  const onPostQuestions = useCallback(async () => {
    const { ok, body } = await recordExchange('POST', `/assessment/questions`, {
      userId,
      language
    });
    if (ok) {
      const data = body as QuestionsResponse;
      setAssessmentId(data.assessmentId);
      setQuestions(data.questions || []);
      setAnswersByQuestionId({});
    }
  }, [recordExchange, userId, language]);

  const onValidateAnswers = useCallback(async () => {
    if (!assessmentId) return;
    const answers = Object.entries(answersByQuestionId).map(
      ([questionId, score]) => ({ questionId, score })
    );
    const { ok } = await recordExchange('POST', `/assessment/answers`, {
      assessmentId,
      answers
    });
    return ok;
  }, [recordExchange, assessmentId, answersByQuestionId]);

  const onCalculateResults = useCallback(async () => {
    if (!assessmentId || questions.length === 0) return;
    // If not all answered via UI, auto-fill remaining with random for convenience
    const filledAnswers: Record<string, number> = { ...answersByQuestionId };
    for (const q of questions) {
      if (filledAnswers[q.id] == null) {
        filledAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
      }
    }
    const answers = Object.entries(filledAnswers).map(
      ([questionId, score]) => ({ questionId, score })
    );
    await recordExchange('POST', `/assessment/results`, {
      assessmentId,
      answers,
      language
    });
  }, [recordExchange, assessmentId, answersByQuestionId, questions, language]);

  const onCheckStatus = useCallback(async () => {
    if (!assessmentId) return;
    await recordExchange(
      'GET',
      `/assessment/status?assessmentId=${encodeURIComponent(assessmentId)}`
    );
  }, [recordExchange, assessmentId]);

  const onGetHistory = useCallback(async () => {
    await recordExchange(
      'GET',
      `/assessment/history?userId=${encodeURIComponent(userId)}`
    );
  }, [recordExchange, userId]);

  const setAllAnswers = useCallback(
    (score: number) => {
      if (questions.length === 0) return;
      const newMap: Record<string, number> = {};
      questions.forEach((q) => {
        newMap[q.id] = score;
      });
      setAnswersByQuestionId(newMap);
    },
    [questions]
  );

  const randomizeAnswers = useCallback(() => {
    if (questions.length === 0) return;
    const newMap: Record<string, number> = {};
    questions.forEach((q) => {
      newMap[q.id] = Math.floor(Math.random() * 5) + 1;
    });
    setAnswersByQuestionId(newMap);
  }, [questions]);

  const resetAll = useCallback(() => {
    setAssessmentId('');
    setQuestions([]);
    setAnswersByQuestionId({});
    setLastExchange(null);
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Big Five API – Interactive Tester</h1>
      <p className='text-sm text-gray-600'>
        Verbose, debug-friendly UI to exercise your Lambda API. Fill inputs,
        call endpoints, inspect raw requests and responses.
      </p>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-3'>
          <label className='block text-sm font-medium'>Base URL</label>
          <input
            className='w-full border rounded px-3 py-2'
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder='https://<api-id>.execute-api.<region>.amazonaws.com/prod'
          />

          <label className='block text-sm font-medium mt-3'>User ID</label>
          <input
            className='w-full border rounded px-3 py-2'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder='tester-123'
          />

          <label className='block text-sm font-medium mt-3'>Language</label>
          <input
            className='w-full border rounded px-3 py-2'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder='en'
          />

          <div className='mt-4 flex flex-wrap gap-2'>
            <button
              onClick={onGetQuestions}
              className='bg-blue-600 text-white px-3 py-2 rounded'
            >
              GET Questions
            </button>
            <button
              onClick={onPostQuestions}
              className='bg-blue-600 text-white px-3 py-2 rounded'
            >
              POST Questions
            </button>
            <button
              onClick={onValidateAnswers}
              className='bg-emerald-600 text-white px-3 py-2 rounded'
              disabled={!assessmentId}
            >
              Validate Answers
            </button>
            <button
              onClick={onCalculateResults}
              className='bg-purple-600 text-white px-3 py-2 rounded'
              disabled={!assessmentId || questions.length === 0}
            >
              Calculate Results
            </button>
            <button
              onClick={onCheckStatus}
              className='bg-slate-600 text-white px-3 py-2 rounded'
              disabled={!assessmentId}
            >
              Check Status
            </button>
            <button
              onClick={onGetHistory}
              className='bg-slate-600 text-white px-3 py-2 rounded'
            >
              Get History
            </button>
            <button
              onClick={resetAll}
              className='bg-gray-200 text-gray-900 px-3 py-2 rounded'
            >
              Reset
            </button>
          </div>

          <div className='mt-2 text-sm'>
            <div>
              Assessment ID:{' '}
              <span className='font-mono'>{assessmentId || '—'}</span>
            </div>
            <div>
              Questions loaded:{' '}
              <span className='font-mono'>{questions.length}</span>
            </div>
            <div>
              Answered: <span className='font-mono'>{answeredCount}</span>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='font-semibold'>Last Request/Response</h2>
          {lastExchange ? (
            <div className='border rounded p-3 text-sm space-y-2'>
              <div>
                <span className='font-semibold'>Request:</span>{' '}
                {lastExchange.method}{' '}
                <span className='font-mono break-all'>{lastExchange.url}</span>
              </div>
              {lastExchange.requestBody && (
                <pre className='bg-gray-50 p-2 rounded overflow-auto max-h-40'>
                  {formatJson(lastExchange.requestBody)}
                </pre>
              )}
              <div className='flex flex-wrap gap-3'>
                {typeof lastExchange.status === 'number' && (
                  <span className='px-2 py-1 rounded bg-gray-100'>
                    Status: {lastExchange.status}
                  </span>
                )}
                {typeof lastExchange.durationMs === 'number' && (
                  <span className='px-2 py-1 rounded bg-gray-100'>
                    Time: {lastExchange.durationMs} ms
                  </span>
                )}
                {typeof lastExchange.ok === 'boolean' && (
                  <span
                    className={`px-2 py-1 rounded ${lastExchange.ok ? 'bg-emerald-100' : 'bg-rose-100'}`}
                  >
                    OK: {String(lastExchange.ok)}
                  </span>
                )}
              </div>
              {lastExchange.error ? (
                <div className='text-rose-700'>Error: {lastExchange.error}</div>
              ) : (
                <pre className='bg-gray-50 p-2 rounded overflow-auto max-h-64'>
                  {formatJson(lastExchange.responseBody)}
                </pre>
              )}
            </div>
          ) : (
            <div className='text-sm text-gray-500'>
              No requests yet. Use the buttons to call your API.
            </div>
          )}
        </div>
      </section>

      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold'>Questions</h2>
          <div className='flex flex-wrap gap-2'>
            <button
              className='bg-gray-100 px-2 py-1 rounded'
              onClick={() => setAllAnswers(1)}
              disabled={questions.length === 0}
            >
              All 1
            </button>
            <button
              className='bg-gray-100 px-2 py-1 rounded'
              onClick={() => setAllAnswers(3)}
              disabled={questions.length === 0}
            >
              All 3
            </button>
            <button
              className='bg-gray-100 px-2 py-1 rounded'
              onClick={() => setAllAnswers(5)}
              disabled={questions.length === 0}
            >
              All 5
            </button>
            <button
              className='bg-gray-100 px-2 py-1 rounded'
              onClick={randomizeAnswers}
              disabled={questions.length === 0}
            >
              Randomize
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className='text-sm text-gray-500'>Load questions to begin.</div>
        ) : (
          <div className='border rounded divide-y'>
            {questions.map((q, idx) => (
              <div className='p-3 space-y-2' key={q.id}>
                <div className='text-sm text-gray-600'>
                  #{idx + 1} • <span className='font-mono'>{q.id}</span> •{' '}
                  {q.domain}
                  {typeof q.facet === 'number' ? `.${q.facet}` : ''}{' '}
                  {q.keyed ? `(${q.keyed})` : ''}
                </div>
                <div className='font-medium'>
                  {q.text || 'No text available'}
                </div>
                <div className='flex gap-2 items-center flex-wrap text-sm'>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label
                      key={score}
                      className={`cursor-pointer px-2 py-1 rounded border ${answersByQuestionId[q.id] === score ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
                    >
                      <input
                        type='radio'
                        name={`q-${q.id}`}
                        className='mr-1'
                        checked={answersByQuestionId[q.id] === score}
                        onChange={() =>
                          setAnswersByQuestionId((prev) => ({
                            ...prev,
                            [q.id]: score
                          }))
                        }
                      />
                      {score}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className='text-xs text-gray-500'>
        <div>Tips:</div>
        <ul className='list-disc ml-6 space-y-1'>
          <li>
            Use GET or POST to load questions. POST generates a fresh
            assessmentId.
          </li>
          <li>
            Validate Answers checks format only; Results calculates full
            personality output.
          </li>
          <li>
            Status is stateless and returns info with answersCount (0) by
            design.
          </li>
          <li>
            History returns an empty array; persist your own history if needed.
          </li>
        </ul>
      </section>
    </div>
  );
}
