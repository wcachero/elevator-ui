import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
export interface Elevator {
  id: number;
  currentFloor: number;
  direction: string;
}


@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  private baseUrl = '/api/Elevator'; // adjust port if needed

  constructor(private http: HttpClient) {}

  getStatus(): Observable<Elevator[]> {
    return this.http.get<Elevator[]>(`${this.baseUrl}/status`);
  }

  sendRequest(floor: number, direction: 'Up' | 'Down'): Observable<any> {
    return this.http.post(`${this.baseUrl}/request`, { floor, direction });
  }

  getPendingFloors(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/pending-floors`).pipe(
      catchError((error) => {
        console.error('Error fetching pending floors:', error);
        return throwError(() => new Error('Failed to fetch pending floors'));
      })
    );
}}
