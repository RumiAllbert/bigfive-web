import { CheckCircle, Code, Globe, Play, Users } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Code className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-xl font-bold text-gray-900'>
                Big Five API Documentation
              </h1>
            </div>
            <a
              href='/api/assessment/questions?userId=demo-user&language=en'
              target='_blank'
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Play className='w-4 h-4' />
              Try Live API
            </a>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Personality Assessment API
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            A stateless, production-ready API for Big Five personality
            assessments. You handle data storage, we provide the assessment
            logic and calculations.
          </p>
          <div className='flex items-center justify-center gap-6 mt-8'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-500' />
              <span className='text-sm text-gray-600'>Stateless Design</span>
            </div>
            <div className='flex items-center gap-2'>
              <Globe className='w-5 h-5 text-blue-500' />
              <span className='text-sm text-gray-600'>20+ Languages</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-purple-500' />
              <span className='text-sm text-gray-600'>120 Questions</span>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className='bg-white rounded-xl border border-gray-200 p-8 mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Play className='w-6 h-6 text-blue-600' />
            Quick Start
          </h3>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                1. Get Questions
              </h4>
              <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                <code>{`curl -X POST http://localhost:3000/api/assessment/questions \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "your-user-id"}'`}</code>
              </pre>
            </div>
            <div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                2. Calculate Results
              </h4>
              <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                <code>{`curl -X POST http://localhost:3000/api/assessment/results \\
  -H "Content-Type: application/json" \\
  -d '{
    "assessmentId": "your-id",
    "answers": [{"questionId": "q1", "score": 4}],
    "language": "en"
  }'`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className='mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <Code className='w-6 h-6 text-green-600' />
            API Endpoints
          </h3>
          <div className='grid gap-6'>
            {/* Get Questions */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  POST
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/questions
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Get Questions
              </h3>
              <p className='text-gray-600 mb-4'>
                Fetch 120 personality assessment questions for a user
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Request Body
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "userId": "user123",
  "language": "en"
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "userId": "user123",
  "questions": [
    {
      "id": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06",
      "text": "Worry about things",
      "keyed": "plus",
      "domain": "N",
      "facet": 1,
      "choices": [
        {"text": "Very Inaccurate", "score": 1, "color": 1},
        {"text": "Moderately Inaccurate", "score": 2, "color": 2},
        {"text": "Neither Accurate Nor Inaccurate", "score": 3, "color": 3},
        {"text": "Moderately Accurate", "score": 4, "color": 4},
        {"text": "Very Accurate", "score": 5, "color": 5}
      ]
    }
  ],
  "assessmentInfo": {
    "name": "Johnson's IPIP NEO-PI-R",
    "shortId": "b5-120",
    "time": 10,
    "questionsCount": 120,
    "language": "en"
  },
  "status": "success"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Validate Answers */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  POST
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/answers
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Validate Answers
              </h3>
              <p className='text-gray-600 mb-4'>
                Validate user answers before processing
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Request Body
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "answers": [
    {
      "questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06",
      "score": 4
    }
  ]
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "success": true,
  "message": "Answers validated successfully. Store them on your side and use /api/assessment/results to calculate personality results.",
  "assessmentId": "assessment_user123_1643723456789",
  "answersCount": 1,
  "status": "validated"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Calculate Results */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  POST
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/results
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Calculate Results
              </h3>
              <p className='text-gray-600 mb-4'>
                Calculate personality assessment results from answers
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Request Body
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "answers": [
    {
      "questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06",
      "score": 4
    }
  ],
  "language": "en"
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "results": {
    "overall": {
      "O": {"score": 45, "count": 10, "result": "high"},
      "C": {"score": 32, "count": 10, "result": "neutral"},
      "E": {"score": 50, "count": 10, "result": "high"},
      "A": {"score": 28, "count": 10, "result": "low"},
      "N": {"score": 25, "count": 10, "result": "low"}
    },
    "facets": {
      "O": {
        "1": {"score": 8, "count": 2, "result": "high"}
      }
    },
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "rawScores": {
      "O": {"score": 45, "count": 10},
      "C": {"score": 32, "count": 10},
      "E": {"score": 50, "count": 10},
      "A": {"score": 28, "count": 10},
      "N": {"score": 25, "count": 10}
    }
  },
  "status": "completed",
  "language": "en",
  "answersProcessed": 1
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personality Traits */}
        <div className='bg-white rounded-xl border border-gray-200 p-8 mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6'>
            Big Five Personality Traits
          </h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                name: 'Openness',
                code: 'O',
                color: 'bg-purple-100 text-purple-800',
                desc: 'Imagination, curiosity, creativity'
              },
              {
                name: 'Conscientiousness',
                code: 'C',
                color: 'bg-blue-100 text-blue-800',
                desc: 'Organization, responsibility, dependability'
              },
              {
                name: 'Extraversion',
                code: 'E',
                color: 'bg-green-100 text-green-800',
                desc: 'Sociability, energy, assertiveness'
              },
              {
                name: 'Agreeableness',
                code: 'A',
                color: 'bg-yellow-100 text-yellow-800',
                desc: 'Cooperation, compassion, trust'
              },
              {
                name: 'Neuroticism',
                code: 'N',
                color: 'bg-red-100 text-red-800',
                desc: 'Emotional stability, anxiety, mood'
              }
            ].map((trait) => (
              <div
                key={trait.code}
                className='p-4 border border-gray-200 rounded-lg'
              >
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-semibold text-gray-900'>{trait.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${trait.color}`}
                  >
                    {trait.code}
                  </span>
                </div>
                <p className='text-sm text-gray-600'>{trait.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='text-center py-8 border-t border-gray-200'>
          <p className='text-gray-600'>
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
