export interface Employee {
  name: string;
  avatar?: string;
}

export interface Recognition {
  _id: string;
  sender: {
    name: string;
    profileImage?: string;
  };
  recipient: {name: string},
  message: string;
  category: 'TEAMWORK' | 'INNOVATION' | 'EXCELLENCE' | 'CUSTOMER_SERVICE';
  points: number;
  kudos: string[];
  pinnedUntil: string | null;
  createdAt: string;
}
