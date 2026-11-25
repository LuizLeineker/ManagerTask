import { Label } from './Label';
import { Task } from './Task';

export interface User {
    userId: number;
    username: string;
    email: string;
    password: string;
    tasks?: Task[];
    labels?: Label[];
}