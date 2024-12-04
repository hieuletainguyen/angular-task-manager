export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}