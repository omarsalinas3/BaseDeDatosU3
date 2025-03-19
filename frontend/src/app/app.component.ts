import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="container my-4">
      <div class="card mb-4">
        <div class="card-body">
          <h1 class="card-title text-center">Sistema de Gestión de Inventario</h1>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}