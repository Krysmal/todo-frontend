
import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from './task.service';

type TaskFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  tasks: Task[] = [];

  newTaskTitle = '';
  filter: TaskFilter = 'all';

  loading = true;
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  // Pobieranie zadań po uruchomieniu strony
  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Błąd pobierania zadań:', error);
        this.errorMessage = 'Nie udało się pobrać zadań.';
        this.loading = false;
      }
    });
  }

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

  // Dodawanie zadania do MongoDB
  addTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) return;

    this.taskService.addTask(title).subscribe({
      next: (newTask) => {
        this.tasks = [...this.tasks, newTask];
        this.newTaskTitle = '';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Błąd dodawania zadania:', error);
        this.errorMessage = 'Nie udało się dodać zadania.';
      }
    });
  }

  // Zmiana statusu zadania w MongoDB
  toggleTask(id: string): void {
    const task = this.tasks.find(task => task.id === id);

    if (!task) return;

    this.taskService.updateTask(id, {
      completed: !task.completed
    }).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(task =>
          task.id === id ? updatedTask : task
        );
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Błąd aktualizacji zadania:', error);
        this.errorMessage = 'Nie udało się zmienić statusu zadania.';
      }
    });
  }

  // Usuwanie zadania z MongoDB
  removeTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Błąd usuwania zadania:', error);
        this.errorMessage = 'Nie udało się usunąć zadania.';
      }
    });
  }

  // Usuwanie wszystkich wykonanych zadań
  clearCompleted(): void {
    const completedTasks = this.tasks.filter(task => task.completed);

    completedTasks.forEach(task => {
      this.removeTask(task.id);
    });
  }

  setFilter(filter: TaskFilter): void {
    this.filter = filter;
  }
}
