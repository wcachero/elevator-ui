import { Component, OnInit } from '@angular/core';
import { ElevatorService, Elevator } from '../../services/elevator.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-elevator-panel',
  templateUrl: './elevator-panel.component.html',
  styleUrls: ['./elevator-panel.component.css'],
  imports: [CommonModule],
})
export class ElevatorPanelComponent implements OnInit {
  elevators: Elevator[] = [];
  floors = Array.from({ length: 10 }, (_, i) => 10 - i);
  pendingFloors: number[] = [];

  constructor(private elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.refresh();
    setInterval(() => this.refresh(), 3000);
  }

  refresh(): void {
    this.elevatorService.getStatus().subscribe(data => this.elevators = data);
    this.elevatorService.getPendingFloors().subscribe(data => this.pendingFloors = data);
  }

  request(floor: number, direction: 'Up' | 'Down') {
    this.elevatorService.sendRequest(floor, direction).subscribe(() => this.refresh());
  }

  isPending(floor: number): boolean {
    return this.pendingFloors.includes(floor);
  }
}
