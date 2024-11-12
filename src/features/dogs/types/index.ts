export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  activity_level: number;
  image: string | null;
  health_conditions: string[];
  created_at: string;
  updated_at: string;
}

export * from '../hooks/types';