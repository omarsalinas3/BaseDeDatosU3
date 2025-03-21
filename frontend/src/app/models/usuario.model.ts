export interface Usuario {
    _id?: string;
    nombreUsuario: string;
    email: string;
    password: string;
    rol: 'Cliente' | 'AlmacenistaInventario' | 'AlmacenistaExhibidor';
  }
  