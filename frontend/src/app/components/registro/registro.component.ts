import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  roles = [
    { value: "Cliente", label: "Cliente" },
    { value: "AlmacenistaInventario", label: "Almacenista de Inventario" },
    { value: "AlmacenistaExhibidor", label: "Almacenista de Exhibidor" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
        nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmarPassword: ['', Validators.required],
        rol: ['Cliente', Validators.required]
      }, {
        validators: this.mustMatch('password', 'confirmarPassword')
      });
  }
  
  //Acceder facilmente a los campos del formulario
  get f() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if(matchingControl.errors && !matchingControl.errors['mustMatch']){
        return;
      }

      
    if(control.value !== matchingControl.value){
      matchingControl.setErrors({ mustMatch: true });
    }else{
      matchingControl.setErrors(null);
    }
    };
  }

  onSubmit(): void{
    this.submitted = true;

    //Detener si el formulario es inválido
    if(this.registerForm.invalid){
      return;
    }

    this.loading = true;
    const userData = {
      nombreUsuario: this.f['nombreUsuario'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      rol: this.f['rol'].value
    };

    this.authService.registro(userData)
    .subscribe({
      next: ()=> {
        this.router.navigate(['/login'], {
          queryParams: { registered: true }
        });
      },
      error: error=>{
        this.error = error.message || 'Error al registrar usuario';
        this.loading = false;
      }
    });
   }
}



