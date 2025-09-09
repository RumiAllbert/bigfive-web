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
            <div className='flex items-center gap-3'>
              <a
                href='/api/assessment/questions?userId=demo-user&language=en'
                target='_blank'
                className='flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm'
              >
                <Play className='w-4 h-4' />
                Local API
              </a>
              <a
                href='/api/assessment/questions?userId=demo-user&language=en'
                target='_blank'
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Play className='w-4 h-4' />
                Test API
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Personality Assessment API
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-6'>
            A stateless, production-ready API for Big Five personality
            assessments. Choose between local development or AWS serverless
            deployment.
          </p>

          {/* Deployment Options */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-8 max-w-4xl mx-auto'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Choose Your Deployment:
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='border border-gray-200 rounded-lg p-4'>
                <h4 className='font-medium text-gray-900 mb-2'>
                  🚀 Local Development
                </h4>
                <p className='text-sm text-gray-600 mb-3'>
                  Run locally for development and testing
                </p>
                <div className='text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 inline-block'>
                  Next.js API Routes
                </div>
                <div className='mt-3'>
                  <code className='text-xs bg-gray-50 px-2 py-1 rounded text-gray-600'>
                    npm run dev → http://localhost:3000
                  </code>
                </div>
              </div>
              <div className='border border-blue-200 bg-blue-50 rounded-lg p-4'>
                <h4 className='font-medium text-blue-900 mb-2'>
                  ☁️ AWS Serverless
                </h4>
                <p className='text-sm text-blue-700 mb-3'>
                  Production-ready with auto-scaling
                </p>
                <div className='text-xs bg-blue-100 px-2 py-1 rounded text-blue-700 inline-block'>
                  Lambda + API Gateway
                </div>
                <div className='mt-3'>
                  <code className='text-xs bg-blue-50 px-2 py-1 rounded text-blue-600'>
                    ./deploy.sh --stage prod
                  </code>
                </div>
              </div>
            </div>

            <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                💡 <strong>Getting a Live API:</strong> Deploy to AWS Lambda
                using the serverless branch, or run locally with{' '}
                <code className='bg-yellow-100 px-1 rounded'>npm run dev</code>{' '}
                to test the API.
              </p>
            </div>
          </div>

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
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-orange-500' />
              <span className='text-sm text-gray-600'>43 Tests</span>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className='bg-white rounded-xl border border-gray-200 p-8 mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <Play className='w-6 h-6 text-blue-600' />
            Quick Start
          </h3>

          {/* Local Development */}
          <div className='mb-6'>
            <h4 className='text-lg font-semibold text-gray-900 mb-3'>
              🏠 Local Development
            </h4>
            <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800 mb-3'>
                💡 <strong>Quick Test:</strong> Click the &quot;Test API&quot;
                button at the top of this page to test the API immediately!
              </p>
            </div>
            <div className='grid md:grid-cols-2 gap-4 mb-4'>
              <div>
                <h5 className='font-medium text-gray-900 mb-2'>
                  1. Start Local Server
                </h5>
                <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                  <code>cd web && npm run dev</code>
                </pre>
                <p className='text-xs text-gray-600 mt-2'>
                  Server runs on http://localhost:3000
                </p>
              </div>
              <div>
                <h5 className='font-medium text-gray-900 mb-2'>
                  2. Test API Manually
                </h5>
                <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                  <code>{`curl -X POST http://localhost:3000/api/assessment/questions \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "test-user"}'`}</code>
                </pre>
                <p className='text-xs text-gray-600 mt-2'>
                  Or use the &quot;Test API&quot; button
                </p>
              </div>
            </div>
          </div>

          {/* AWS Serverless */}
          <div className='border-t border-gray-200 pt-6'>
            <h4 className='text-lg font-semibold text-gray-900 mb-3'>
              ☁️ AWS Serverless (Production)
            </h4>
            <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-sm text-green-800 mb-2'>
                🚀 <strong>Get a Live API:</strong> Deploy to AWS Lambda for a
                production-ready API endpoint.
              </p>
            </div>
            <div className='grid md:grid-cols-2 gap-4 mb-4'>
              <div>
                <h5 className='font-medium text-gray-900 mb-2'>
                  1. Switch to Serverless Branch
                </h5>
                <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                  <code>git checkout aws-serverless</code>
                </pre>
              </div>
              <div>
                <h5 className='font-medium text-gray-900 mb-2'>
                  2. Deploy to AWS
                </h5>
                <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                  <code>./deploy.sh --stage prod</code>
                </pre>
              </div>
            </div>
            <div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <h5 className='font-medium text-gray-900 mb-2'>
                3. Get Your Live API URL
              </h5>
              <p className='text-sm text-gray-700 mb-2'>
                After deployment, you&apos;ll get an API Gateway URL like:
              </p>
              <pre className='bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto'>
                <code>
                  https://abc123.execute-api.us-east-1.amazonaws.com/prod/assessment/questions
                </code>
              </pre>
              <p className='text-sm text-gray-700 mt-2'>
                Use this URL in your applications for production API calls.
              </p>
            </div>
          </div>

          {/* Common Example */}
          <div className='bg-gray-50 rounded-lg p-4'>
            <h5 className='font-medium text-gray-900 mb-2'>
              📝 Complete Example
            </h5>
            <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
              <code>{`# Calculate personality results
curl -X POST YOUR_API_URL/assessment/results \\
  -H "Content-Type: application/json" \\
  -d '{
    "assessmentId": "assessment_test-user_1234567890",
    "answers": [
      {"questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06", "score": 4},
      {"questionId": "d50a597f-632b-4f7b-89e6-6d85b50fd1c9", "score": 3}
    ],
    "language": "en"
  }'`}</code>
            </pre>
            <p className='text-sm text-gray-600 mt-2'>
              Replace <code>YOUR_API_URL</code> with your local URL or AWS API
              Gateway URL
            </p>
          </div>
        </div>

        {/* API Endpoints */}
        <div className='mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Code className='w-6 h-6 text-green-600' />
            API Endpoints
          </h3>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <h4 className='text-sm font-semibold text-blue-900 mb-2'>
              Available Endpoints:
            </h4>
            <div className='grid md:grid-cols-2 gap-2 text-sm'>
              <div>
                <code className='bg-white px-2 py-1 rounded text-blue-800'>
                  GET/POST /assessment/questions
                </code>
              </div>
              <div>
                <code className='bg-white px-2 py-1 rounded text-blue-800'>
                  POST /assessment/answers
                </code>
              </div>
              <div>
                <code className='bg-white px-2 py-1 rounded text-blue-800'>
                  POST /assessment/results
                </code>
              </div>
              <div>
                <code className='bg-white px-2 py-1 rounded text-blue-800'>
                  GET /assessment/status
                </code>
              </div>
              <div>
                <code className='bg-white px-2 py-1 rounded text-blue-800'>
                  GET /assessment/history
                </code>
              </div>
            </div>
            <p className='text-xs text-blue-700 mt-2'>
              All endpoints work with both local development and AWS serverless
              deployment
            </p>
          </div>
          <div className='grid gap-6'>
            {/* Get Questions */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  POST
                </span>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                  GET
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/questions
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Get Questions
              </h3>
              <p className='text-gray-600 mb-4'>
                Fetch 120 personality assessment questions for a user. Supports
                both POST and GET methods.
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    POST Request Body
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "userId": "user123",
  "language": "en"
}`}</code>
                  </pre>
                  <h4 className='text-sm font-medium text-gray-900 mb-2 mt-4'>
                    GET Request
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>
                      /api/assessment/questions?userId=user123&language=en
                    </code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
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
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "answers": [
    {
      "questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06",
      "score": 4
    },
    {
      "questionId": "d50a597f-632b-4f7b-89e6-6d85b50fd1c9",
      "score": 3
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
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "answers": [
    {
      "questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06",
      "score": 4
    },
    {
      "questionId": "d50a597f-632b-4f7b-89e6-6d85b50fd1c9",
      "score": 3
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
      "O": {"score": 45, "count": 10, "result": "high", "average": 4.5, "percentage": 90},
      "C": {"score": 32, "count": 10, "result": "neutral", "average": 3.2, "percentage": 64},
      "E": {"score": 50, "count": 10, "result": "high", "average": 5.0, "percentage": 100},
      "A": {"score": 28, "count": 10, "result": "low", "average": 2.8, "percentage": 56},
      "N": {"score": 25, "count": 10, "result": "low", "average": 2.5, "percentage": 50}
    },
    "facets": {
      "O": {
        "1": {"score": 8, "count": 2, "result": "high", "average": 4.0, "percentage": 80}
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

            {/* Get Assessment Status */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                  GET
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/status
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Get Assessment Status
              </h3>
              <p className='text-gray-600 mb-4'>
                Get basic information about an assessment. Useful for tracking
                assessment state.
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Request
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>
                      /api/assessment/status?assessmentId=assessment_user123_1643723456789
                    </code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "assessmentId": "assessment_user123_1643723456789",
  "userId": "user123",
  "status": "info_only",
  "message": "This is a stateless API. Track assessment status on your side.",
  "apiType": "stateless"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Get Assessment History */}
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                  GET
                </span>
                <code className='text-sm bg-gray-100 px-2 py-1 rounded font-mono'>
                  /api/assessment/history
                </code>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Get Assessment History
              </h3>
              <p className='text-gray-600 mb-4'>
                Get user&apos;s assessment history. Returns empty array since
                this is a stateless API.
              </p>

              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Request
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>/api/assessment/history?userId=user123</code>
                  </pre>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Response
                  </h4>
                  <pre className='bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto'>
                    <code>{`{
  "userId": "user123",
  "message": "This is a stateless API. Track assessment history on your side.",
  "apiType": "stateless",
  "history": [],
  "note": "Use your own database to store and retrieve assessment history."
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
          <div className='mb-4'>
            <h4 className='text-sm font-semibold text-gray-900 mb-2'>
              🚀 Deployment Options
            </h4>
            <div className='flex items-center justify-center gap-4 text-sm'>
              <a href='/docs' className='text-blue-600 hover:text-blue-800'>
                📚 API Docs
              </a>
              <span className='text-gray-400'>|</span>
              <a
                href='https://github.com/your-repo/bigfive-web'
                target='_blank'
                className='text-blue-600 hover:text-blue-800'
              >
                💻 Source Code
              </a>
              <span className='text-gray-400'>|</span>
              <a
                href='https://bigfive-test.com'
                target='_blank'
                className='text-blue-600 hover:text-blue-800'
              >
                🌐 Live Demo
              </a>
            </div>
          </div>
          <p className='text-gray-600 mb-2'>
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
          <p className='text-sm text-gray-500'>
            Supports both local development and AWS serverless deployment with
            43 comprehensive tests
          </p>
        </div>
      </div>
    </div>
  );
}
