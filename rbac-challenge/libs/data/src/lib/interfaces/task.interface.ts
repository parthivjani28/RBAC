// libs/data/src/lib/interfaces/task.interface.ts
export interface Taskin {
  id: number;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
}
