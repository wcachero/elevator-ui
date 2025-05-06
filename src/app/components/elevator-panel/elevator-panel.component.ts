import { Component, OnInit } from '@angular/core';
import { ElevatorService, Elevator } from '../../services/elevator.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-elevator-panel',
  templateUrl: './elevator-panel.component.html',
  styleUrls: ['./elevator-panel.component.css'],
  imports: [CommonModule, FormsModule],
})

export class ElevatorPanelComponent implements OnInit {
  elevators: Elevator[] = [];
  floors = Array.from({ length: 10 }, (_, i) => 10 - i);
  pendingFloors: number[] = [];
  selectedFloor: number | null = null; // Stores the current floor where the request originates
  showModal: boolean = false; // Controls modal visibility
  direction: 'Up' | 'Down' | null = null; // Stores the selected direction


  constructor(private elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.refresh();
    setInterval(() => this.refresh(), 3000);
  }

  refresh(): void {
    this.elevatorService.getStatus().subscribe(
      (data) => {
        // Sort elevators by elevatorId in ascending order
        this.elevators = data.sort((a, b) => a.elevatorId - b.elevatorId);
      },
      (error) => {
        console.error('Error fetching elevator status:', error);
        this.elevators = []; // Ensure elevators array is initialized
      }
    );
  }

  openModal(floor: number, direction: 'Up' | 'Down'): void {
    this.selectedFloor = floor; // Set the current floor
    this.direction = direction; // Set the direction
    this.showModal = true; // Show the modal
  }

  closeModal(): void {
    this.showModal = false; // Hide the modal
    this.selectedFloor = null; // Reset the selected floor
    this.direction = null; // Reset the direction
  }

  setDestination(destinationFloor: number): void {
    if (this.selectedFloor !== null && this.direction) {
      this.elevatorService
        .sendRequest(this.selectedFloor, destinationFloor, this.direction)
        .subscribe(() => {
          this.refresh();
          this.closeModal(); // Close the modal after setting the destination
        });
    }
  
  }
  getElevatorColorForElevator(floor: number, elevatorId: number): string {
    const elevator = this.elevators.find(e => e.elevatorId === elevatorId);
    if (!elevator) {
      return 'lightgray'; // Default color if the elevator is not found
    }
    return elevator.currentFloor === floor && elevator.direction !== 'Idle' 
      ? this.getElevatorColor(floor, elevator.direction) 
      : 'lightgray';
  }
  getElevatorColor(floor: number, direction: 'Up' | 'Down'): string {
    // Find the elevator either on the current floor or moving through the floor
    const elevator = this.elevators.find(e => 
      e.currentFloor === floor || this.isElevatorMovingThroughFloor(e, floor, direction)
    );
  
    if (!elevator) {
      return 'lightgray'; // Default color if no elevator is on or moving through this floor
    }
  
    // Assign unique colors based on elevator ID
    switch (elevator.elevatorId) {
      case 1:
        return 'red'; // Elevator 1
      case 2:
        return 'blue'; // Elevator 2
      case 3:
        return 'green'; // Elevator 3
      case 4:
        return 'orange'; // Elevator 4
      default:
        return 'lightgray'; // Default color for unknown elevators
    }
  }
  
  // Helper method to check if an elevator is moving through a floor in a specific direction
  private isElevatorMovingThroughFloor(elevator: Elevator, floor: number, direction: 'Up' | 'Down'): boolean {
    if (direction === 'Up' && elevator.direction === 'Up' && elevator.currentFloor < floor && elevator.destinations.some(dest => dest >= floor)) {
      return true;
    }
    if (direction === 'Down' && elevator.direction === 'Down' && elevator.currentFloor > floor && elevator.destinations.some(dest => dest <= floor)) {
      return true;
    }
    return false;
  }
  
  getButtonColor(floor: number, direction: 'Up' | 'Down'): string {
    // Check if any elevator matches the requested direction and floor conditions
    const elevator = this.elevators.find(e => {
      if (direction === 'Up') {
        return e.direction === 'Up' && e.currentFloor <= floor && e.destinations.some(dest => dest >= floor);
      } else if (direction === 'Down') {
        return e.direction === 'Down' && e.currentFloor >= floor && e.destinations.some(dest => dest <= floor);
      }
      return false;
    });
  
    if (!elevator) {
      return 'lightgray'; // Default color if no elevator matches the request
    }
  
    // Assign colors based on elevator ID
    switch (elevator.elevatorId) {
      case 1:
        return 'red'; // Elevator 1
      case 2:
        return 'blue'; // Elevator 2
      case 3:
        return 'green'; // Elevator 3
      case 4:
        return 'orange'; // Elevator 4
      default:
        return 'lightgray'; // Default color for unknown elevators
    }
  }
}