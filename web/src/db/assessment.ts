import { ObjectId } from 'mongodb';
import { Assessment, AssessmentAnswer, AssessmentResult, User } from '../models/User';
import { connectToDatabase } from './index';

export class AssessmentService {
  private static async getCollection(collectionName: string) {
    const db = await connectToDatabase();
    return db.collection(collectionName);
  }

  // User operations
  static async createOrUpdateUser(userData: Partial<User>): Promise<User> {
    const usersCollection = await this.getCollection('users');
    const now = new Date();

    const result = await usersCollection.findOneAndUpdate(
      { userId: userData.userId },
      {
        $set: {
          ...userData,
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    return result as User;
  }

  static async getUser(userId: string): Promise<User | null> {
    const usersCollection = await this.getCollection('users');
    return usersCollection.findOne({ userId }) as Promise<User | null>;
  }

  // Assessment operations
  static async createAssessment(assessmentData: Omit<Assessment, '_id' | 'createdAt' | 'updatedAt'>): Promise<Assessment> {
    const assessmentsCollection = await this.getCollection('assessments');

    const assessment: Assessment = {
      ...assessmentData,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await assessmentsCollection.insertOne(assessment);
    return assessment;
  }

  static async getAssessment(assessmentId: string): Promise<Assessment | null> {
    const assessmentsCollection = await this.getCollection('assessments');
    return assessmentsCollection.findOne({ assessmentId }) as Promise<Assessment | null>;
  }

  static async getUserAssessments(userId: string): Promise<Assessment[]> {
    const assessmentsCollection = await this.getCollection('assessments');
    return assessmentsCollection.find({ userId }).sort({ createdAt: -1 }).toArray() as Promise<Assessment[]>;
  }

  static async updateAssessmentAnswers(assessmentId: string, answers: AssessmentAnswer[]): Promise<void> {
    const assessmentsCollection = await this.getCollection('assessments');

    await assessmentsCollection.updateOne(
      { assessmentId },
      {
        $push: { answers: { $each: answers } },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async completeAssessment(
    assessmentId: string,
    results: AssessmentResult,
    timeElapsed: number
  ): Promise<void> {
    const assessmentsCollection = await this.getCollection('assessments');

    await assessmentsCollection.updateOne(
      { assessmentId },
      {
        $set: {
          status: 'completed',
          results,
          completedAt: new Date(),
          timeElapsed,
          updatedAt: new Date()
        }
      }
    );
  }

  static async updateAssessmentStatus(assessmentId: string, status: Assessment['status']): Promise<void> {
    const assessmentsCollection = await this.getCollection('assessments');

    await assessmentsCollection.updateOne(
      { assessmentId },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );
  }

  // Utility methods
  static async assessmentExists(assessmentId: string): Promise<boolean> {
    const assessment = await this.getAssessment(assessmentId);
    return !!assessment;
  }

  static async getAssessmentCount(userId: string): Promise<number> {
    const assessmentsCollection = await this.getCollection('assessments');
    return assessmentsCollection.countDocuments({ userId });
  }

  static async deleteAssessment(assessmentId: string): Promise<void> {
    const assessmentsCollection = await this.getCollection('assessments');
    await assessmentsCollection.deleteOne({ assessmentId });
  }
}
