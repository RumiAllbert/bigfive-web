import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  userId: string; // External user ID from your business system
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>; // Additional user data from your system
}

export interface Assessment {
  _id?: ObjectId;
  userId: string; // External user ID
  assessmentId: string; // Unique ID for this assessment
  language: string;
  status: 'in_progress' | 'completed' | 'expired';
  startedAt: Date;
  completedAt?: Date;
  timeElapsed?: number; // in seconds
  answers: AssessmentAnswer[];
  results?: AssessmentResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentAnswer {
  questionId: string;
  score: number; // 1-5 Likert scale
  domain: string;
  facet: number;
  answeredAt: Date;
}

export interface AssessmentResult {
  overall: {
    [domain: string]: {
      score: number;
      count: number;
      result: 'low' | 'neutral' | 'high';
    };
  };
  facets: {
    [domain: string]: {
      [facet: number]: {
        score: number;
        count: number;
        result: 'low' | 'neutral' | 'high';
      };
    };
  };
  detailedResults: any[]; // Full detailed results from the results package
  generatedAt: Date;
}

export interface CreateAssessmentRequest {
  userId: string;
  language?: string;
  metadata?: Record<string, any>;
}

export interface SubmitAnswersRequest {
  assessmentId: string;
  answers: {
    questionId: string;
    score: number;
  }[];
}
