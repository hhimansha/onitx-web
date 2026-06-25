// Shared domain types — expand as features are built

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
}
