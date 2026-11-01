
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8000/api/tasks';

  constructor(private http: HttpClient) {}

  // Pobieranie wszystkich zadań
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Dodawanie zadania
  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title });
  }

  // Aktualizacja zadania
  updateTask(
    id: string,
    changes: Partial<Pick<Task, 'title' | 'completed'>>
  ): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, changes);
  }

  // Usuwanie zadania
  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
