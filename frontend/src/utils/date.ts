export function todayIso(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDate(date?: string | null): string {
    if (!date) return "";
    return date.slice(0, 10).split("-").reverse().join("/");
}

export function isOverdue(date: string | null | undefined, isCompleted: boolean): boolean {
    if (!date || isCompleted) return false;
    return date.slice(0, 10) < todayIso();
}
