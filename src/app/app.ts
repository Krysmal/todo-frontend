
import { Component } from '@angular/core';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type TaskFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  tasks: Task[] = [
    { id: 1, title: 'Stworzyć frontend w Angularze', completed: true },
    { id: 2, title: 'Stworzyć backend w PHP', completed: false },
    { id: 3, title: 'Połączyć Angular z PHP', completed: false },
    { id: 4, title: 'Skonfigurować bazę MySQL', completed: false }
  ];

  newTaskTitle = '';
  filter: TaskFilter = 'all';

  get completedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get activeCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'active') {
      return this.tasks.filter(task => !task.completed);
    }

    if (this.filter === 'completed') {
      return this.tasks.filter(task => task.completed);
    }

    return this.tasks;
  }

  onTitleInput(event: Event): void {
    this.newTaskTitle = (event.target as HTMLInputElement).value;
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) return;

    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false
    };

    this.tasks = [...this.tasks, newTask];
    this.newTaskTitle = '';
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter(task => !task.completed);
  }

  setFilter(filter: TaskFilter): void {
    this.filter = filter;
  }
}
