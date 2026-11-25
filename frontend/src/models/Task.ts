import { Label } from './Label';

export interface Task {
    taskId: number;
    name: string;
    description?: string | null;
    isCompleted: boolean;
    createdAt?: string;
    dueDate?: string | null;
    userId: number;
    labelId?: number | null;
    label?: Label | null;
}
