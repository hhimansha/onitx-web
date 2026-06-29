export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  designation?: string;
  profileImage?: string;
  createdAt: string;
}

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskAssignment {
  user: Pick<User, "id" | "name" | "email" | "designation" | "profileImage">;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdBy?: User;
  assignments?: TaskAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedToIds?: string[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  createdAt: string;
  user: Pick<User, "id" | "name" | "email" | "profileImage">;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  designation?: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UserWithStats extends User {
  taskCount?: number;
  openTasks?: number;
  inProgressTasks?: number;
  doneTasks?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
