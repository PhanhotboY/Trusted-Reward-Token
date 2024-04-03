export interface IReason {
  id: string;
  title: string;
  value: number;
  duration: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
