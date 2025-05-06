// filepath: d:\Users\wilson\Desktop\FileSharingUI\FileSharing.UI\src\app\app.routes.ts
import { Routes } from '@angular/router';
import { ElevatorPanelComponent } from './components/elevator-panel/elevator-panel.component';

export const routes: Routes = [
  { path: '', component: ElevatorPanelComponent, title: 'Elev' }, // Default route
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];