import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
export interface Elevator {
  elevatorId: number; 
  currentFloor: number; // Ensure this is always a number
  direction: 'Up' | 'Down' | 'Idle';
  destinations: number[];
  status?: 'Online' | 'Offline'; 
}

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  private baseUrl = '/api/Elevator'; // Adjust port if needed

  constructor(private http: HttpClient) {}

  getStatus(): Observable<Elevator[]> {
    return this.http.get<Elevator[]>(`${this.baseUrl}/status`).pipe(
      catchError((error) => {
        console.error('Error fetching elevator status:', error);
       
        return of([
          { elevatorId: 1, currentFloor: 0, direction: 'Idle', destinations: [], status: 'Offline' },
          { elevatorId: 2, currentFloor: 0, direction: 'Idle', destinations: [], status: 'Offline' },
          { elevatorId: 3, currentFloor: 0, direction: 'Idle', destinations: [], status: 'Offline' },
          { elevatorId: 4, currentFloor: 0, direction: 'Idle', destinations: [], status: 'Offline' },
        ] as Elevator[]);
      })
    );
  }

  sendRequest(currentFloor: number, destinationFloor: number, direction: 'Up' | 'Down'): Observable<any> {
    if (currentFloor < 0 || destinationFloor < 0) {
      console.error('Invalid floor values:', { currentFloor, destinationFloor });
      return throwError(() => new Error('Invalid floor values'));
    }
    return this.http.post(`${this.baseUrl}/request`, {
      CurrentFloor: currentFloor,
      Floor: destinationFloor,
      Direction: direction
    }, { responseType: 'text' });
  }

  getPendingFloors(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/pending-floors`).pipe(
      catchError((error) => {
        console.error('Error fetching pending floors:', error);
        return throwError(() => new Error('Failed to fetch pending floors'));
      })
    );
  }
}