export interface Task {
  id?: number ;
  isEditing?: boolean;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date; 
}