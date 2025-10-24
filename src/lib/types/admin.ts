export interface RecognitionType {
  _id: string;
  name: string;
  category: 'TEAMWORK' | 'INNOVATION' | 'EXCELLENCE' | 'CUSTOMER_SERVICE';
  pointValue: number;
  active: boolean;
  createdAt: string;
}

export interface PointsDistribution {
  _id: string;
  userId: string;
  points: number;
  reason: string;
  distributedAt: string;
  user: {
    name: string;
    department: string;
  };
  createdAt: string;
}

export interface User {
  _id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  profileImage?: string;
  profileImageUrl?: string;
  active?: boolean;
  createdAt?: string;
}
