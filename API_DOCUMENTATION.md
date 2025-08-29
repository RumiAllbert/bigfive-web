# Big Five Personality Assessment API

This is a **stateless API** for Big Five personality assessments. You handle all data storage on your side - the API only provides the assessment logic and calculations.

## Key Features
- ✅ **Stateless Design** - No database storage, you manage all data
- ✅ **Complete Assessment Logic** - Questions, validation, and scoring
- ✅ **Multi-language Support** - 20+ languages available
- ✅ **Detailed Results** - Overall traits and facet breakdowns
- ✅ **RESTful API** - Simple HTTP endpoints

## Base URL
```
https://your-domain.com/api/assessment
```
*Replace `your-domain.com` with your actual domain*

## Quick Start
```bash
# 1. Start the server
cd web && npm run dev

# 2. Get questions
curl -X POST https://your-domain.com/api/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'

# 3. Calculate results
curl -X POST https://your-domain.com/api/assessment/results \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "assessment_your-user-id_1234567890",
    "answers": [{"questionId": "q1", "score": 4}],
    "language": "en"
  }'
```

## Assessment Flow
1. **Get Questions** - Fetch 120 personality questions
2. **Collect Answers** - Store user responses in your database
3. **Calculate Results** - Send answers to API for scoring
4. **Store Results** - Save personality analysis in your system

## Endpoints

### 1. Create Assessment & Get Questions

**POST** `/api/assessment/questions`

Creates a new assessment for a user and returns the personality test questions.

#### Request Body
```json
{
  "userId": "string (required)",
  "language": "string (optional, default: 'en')",
  "metadata": "object (optional)"
}
```

#### Response
```json
{
  "assessmentId": "uuid-string",
  "questions": [
    {
      "id": "question-uuid",
      "text": "Question text",
      "domain": "O",
      "facet": 1,
      "keyed": "plus",
      "num": 1,
      "choices": [
        {
          "text": "Very Inaccurate",
          "score": 1,
          "color": 1
        },
        {
          "text": "Moderately Inaccurate",
          "score": 2,
          "color": 2
        },
        {
          "text": "Neither Accurate Nor Inaccurate",
          "score": 3,
          "color": 3
        },
        {
          "text": "Moderately Accurate",
          "score": 4,
          "color": 4
        },
        {
          "text": "Very Accurate",
          "score": 5,
          "color": 5
        }
      ]
    }
  ],
  "assessmentInfo": {
    "name": "Johnson's IPIP NEO-PI-R",
    "id": "johnson-120-ipip-neo-pi-r",
    "shortId": "b5-120",
    "time": 10,
    "questionsCount": 120,
    "language": "en"
  },
  "status": "success"
}
```

#### Alternative: Get Questions for Existing Assessment

**GET** `/api/assessment/questions?assessmentId=uuid-string`

Returns questions for an existing assessment.

### 2. Submit Answers

**POST** `/api/assessment/answers`

Submits user answers for an assessment.

#### Request Body
```json
{
  "assessmentId": "uuid-string (required)",
  "answers": [
    {
      "questionId": "question-uuid",
      "score": 4
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "message": "Answers submitted successfully",
  "answersCount": 1
}
```

### 3. Calculate Results

**POST** `/api/assessment/results`

Calculates personality assessment results from user answers. Send the assessmentId, answers array, and language.

#### Request Body
```json
{
  "assessmentId": "string (required)",
  "answers": [
    {
      "questionId": "string (required)",
      "score": "number 1-5 (required)"
    }
  ],
  "language": "string (optional, default: 'en')"
}
```

#### Response
```json
{
  "assessmentId": "your-assessment-id",
  "results": {
    "overall": {
      "O": {
        "score": 45,
        "count": 10,
        "result": "high"
      },
      "C": {
        "score": 32,
        "count": 10,
        "result": "neutral"
      },
      "E": {
        "score": 50,
        "count": 10,
        "result": "high"
      },
      "A": {
        "score": 28,
        "count": 10,
        "result": "low"
      },
      "N": {
        "score": 25,
        "count": 10,
        "result": "low"
      }
    },
    "facets": {
      "O": {
        "1": {
          "score": 8,
          "count": 2,
          "result": "high"
        },
        "2": {
          "score": 6,
          "count": 2,
          "result": "neutral"
        }
      }
    },
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "rawScores": {
      "O": { "score": 45, "count": 10 },
      "C": { "score": 32, "count": 10 },
      "E": { "score": 50, "count": 10 },
      "A": { "score": 28, "count": 10 },
      "N": { "score": 25, "count": 10 }
    }
  },
  "status": "completed",
  "language": "en",
  "answersProcessed": 10
}
```

#### Alternative: Get Cached Results

**GET** `/api/assessment/results?assessmentId=uuid-string`

Returns previously calculated results for a completed assessment.

### 4. Check Assessment Status (Info Only)

**GET** `/api/assessment/status?assessmentId=assessment-string`

Returns informational response about the stateless nature of the API. Since this is a stateless API, it doesn't track assessment status - you should manage this on your side.

#### Request
```bash
curl "https://your-domain.com/api/assessment/status?assessmentId=assessment_user123_1234567890"
```

#### Response
```json
{
  "assessmentId": "assessment_user123_1234567890",
  "userId": "user123",
  "status": "info_only",
  "message": "This is a stateless API. Track assessment status on your side.",
  "apiType": "stateless"
}
```

### 5. Get User Assessment History (Info Only)

**GET** `/api/assessment/history?userId=user-id`

Returns informational response about the stateless nature of the API. Since this is a stateless API, it doesn't store assessment history - you should manage this on your side.

#### Request
```bash
curl "https://your-domain.com/api/assessment/history?userId=user123"
```

#### Response
```json
{
  "userId": "user123",
  "message": "This is a stateless API. Track assessment history on your side.",
  "apiType": "stateless",
  "history": [],
  "note": "Use your own database to store and retrieve assessment history."
}
```

## Data Models

### Personality Domains
- **O** - Openness to Experience
- **C** - Conscientiousness
- **E** - Extraversion
- **A** - Agreeableness
- **N** - Neuroticism

### Result Levels
- **high** - Score > 3.5 (above average)
- **neutral** - Score between 2.5-3.5 (average)
- **low** - Score < 2.5 (below average)

### Assessment Status
- **in_progress** - Assessment started, answers being collected
- **completed** - Assessment finished, results calculated
- **expired** - Assessment timed out or invalidated

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- **200** - Success
- **400** - Bad Request (invalid parameters)
- **404** - Not Found (assessment/user doesn't exist)
- **500** - Internal Server Error

## Usage Examples

### JavaScript/Node.js Example

```javascript
// 1. Create assessment
const createResponse = await fetch('https://your-domain.com/api/assessment/questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    language: 'en'
  })
});

const { assessmentId, questions } = await createResponse.json();

// 2. Submit answers
const answers = questions.map(question => ({
  questionId: question.id,
  score: Math.floor(Math.random() * 5) + 1 // Random score 1-5
}));

await fetch('https://your-domain.com/api/assessment/answers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    assessmentId,
    answers
  })
});

// 3. Get results
const resultsResponse = await fetch('https://your-domain.com/api/assessment/results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ assessmentId })
});

const { results } = await resultsResponse.json();
console.log('Personality Results:', results);
```

### Python Example

```python
import requests

# 1. Create assessment
create_response = requests.post('https://your-domain.com/api/assessment/questions',
  json={
    'userId': 'user123',
    'language': 'en'
  }
)

data = create_response.json()
assessment_id = data['assessmentId']
questions = data['questions']

# 2. Submit answers
answers = [
  {'questionId': q['id'], 'score': 4}  # Example score
  for q in questions
]

requests.post('https://your-domain.com/api/assessment/answers',
  json={
    'assessmentId': assessment_id,
    'answers': answers
  }
)

# 3. Get results
results_response = requests.post('https://your-domain.com/api/assessment/results',
  json={'assessmentId': assessment_id}
)

results = results_response.json()
print('Personality Results:', results['results'])
```

### cURL Example

```bash
# 1. Create assessment
curl -X POST https://your-domain.com/api/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "language": "en"}'

# 2. Submit answers (replace ASSESSMENT_ID with actual ID)
curl -X POST https://your-domain.com/api/assessment/answers \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "ASSESSMENT_ID",
    "answers": [
      {"questionId": "question-uuid", "score": 4}
    ]
  }'

# 3. Get results
curl -X POST https://your-domain.com/api/assessment/results \
  -H "Content-Type: application/json" \
  -d '{"assessmentId": "ASSESSMENT_ID"}'
```

## Stateless Design

This API is **completely stateless** - it doesn't store any data. Here's what this means for your implementation:

### What You Need to Store
- **User Data**: Store user profiles and information in your database
- **Assessment Data**: Track assessment progress, answers, and completion status
- **Results**: Save calculated personality results for future retrieval
- **History**: Maintain assessment history and analytics

### What the API Provides
- **Questions**: Personality assessment questions in multiple languages
- **Validation**: Answer format and range validation
- **Calculation**: Big Five personality trait scoring and analysis
- **Facet Analysis**: Detailed personality facet breakdowns

### Recommended Database Schema
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR,
  created_at TIMESTAMP
);

-- Assessments table
CREATE TABLE assessments (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  status VARCHAR, -- 'in_progress', 'completed', 'expired'
  language VARCHAR,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Answers table
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR REFERENCES assessments(id),
  question_id VARCHAR,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP
);

-- Results table
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR REFERENCES assessments(id),
  personality_data JSONB,
  created_at TIMESTAMP
);
```

## Supported Languages

The API supports multiple languages for the personality questions:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- And many more...

## Production Considerations

### Security & Authentication
1. **API Authentication**: Implement authentication middleware to secure endpoints
2. **Rate Limiting**: Add rate limiting to prevent abuse and ensure fair usage
3. **Input Validation**: All input validation is handled by the API, but validate on your side too
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS settings for your frontend domain

### Database & Storage
1. **Database Choice**: Use any database that fits your needs (PostgreSQL, MySQL, MongoDB, etc.)
2. **Data Backup**: Regular backups of user data and assessment results
3. **Data Retention**: Implement data retention policies for user privacy
4. **Scalability**: Ensure your database can handle expected load

### Monitoring & Analytics
1. **API Monitoring**: Track API usage, response times, and error rates
2. **User Analytics**: Monitor assessment completion rates and user engagement
3. **Performance**: Set up alerts for slow response times
4. **Error Tracking**: Log and monitor API errors for debugging

### Testing & Quality Assurance
1. **Automated Testing**: Use the provided test suites for continuous integration
2. **Load Testing**: Test with expected concurrent user loads
3. **Integration Testing**: Test with your frontend and database systems
4. **User Acceptance Testing**: Validate with real users

### Deployment
1. **Environment Variables**: Set up proper environment configuration
2. **Containerization**: Consider Docker for consistent deployments
3. **CI/CD**: Set up automated deployment pipelines
4. **Health Checks**: Implement health check endpoints

### Privacy & Compliance
1. **Data Protection**: Ensure compliance with GDPR, CCPA, or other regulations
2. **User Consent**: Obtain proper consent for personality data collection
3. **Data Minimization**: Only collect necessary data
4. **User Rights**: Implement data deletion and export features

## Support

For technical support or questions about the API, please refer to the project documentation or contact the development team.
