import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="denied-container">
      <div class="denied-content">
        <div class="denied-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
        <h1>Acceso denegado</h1>
        <p>No tienes permiso para acceder a esta sección</p>
        <div class="denied-actions">
          <button class="btn-logout" (click)="authService.logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Cerrar sesión
          </button>
          <a routerLink="/" class="btn-home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 20px;
    }
    
    .denied-content {
      text-align: center;
      max-width: 500px;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .denied-icon {
      color: #dc3545;
      margin-bottom: 20px;
    }
    
    .denied-icon svg {
      width: 80px;
      height: 80px;
    }
    
    h1 {
      color: #dc3545;
      margin-bottom: 10px;
      font-size: 24px;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .denied-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-logout {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 14px;
    }
    
    .btn-logout:hover {
      background-color: #c82333;
    }
    
    .btn-home {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background-color: #6c757d;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      transition: background-color 0.3s;
      font-size: 14px;
    }
    
    .btn-home:hover {
      background-color: #5a6268;
      color: white;
    }
    
    @media (max-width: 576px) {
      .denied-content {
        padding: 20px;
      }
      
      .denied-actions {
        flex-direction: column;
      }
      
      .btn-logout, .btn-home {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AccesoDenegadoComponent {
  constructor(public authService: AuthService) {}
}