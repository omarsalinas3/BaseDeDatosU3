import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="container my-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-color: #f9fafb;
}

.header-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.header-content {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
}

.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}
  `]
})
export class AppComponent {
  title = 'frontend';
}