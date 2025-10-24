export interface Employee {
  name: string;
  avatar?: string;
}

export interface Recognition {
  _id: string;
  sender: string | {
    name: string;
    profileImage?: string;
  };
  recipient: string | {name: string};
  message: string;
  category: 'TEAMWORK' | 'INNOVATION' | 'EXCELLENCE' | 'CUSTOMER_SERVICE';
  points: number;
  kudos: string[];
  pinnedUntil: string | null;
  createdAt: string;
  organizationId?: string;
  __v?: number;
}
