export interface LabelCount {
    labelId: number | null;
    name: string;
    total: number;
    pending: number;
}

export interface Summary {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    dueToday: number;
    byLabel: LabelCount[];
}
