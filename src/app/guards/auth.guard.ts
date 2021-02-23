import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
//servicio que implementa canActivate
//En canActivate es el metodo que tiene que implementar angular para confrimar si se puede activar dicha ruta o no
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthService, //Inyectamos el servicio porque necesitamos saber si el user está autenticado 
               private router: Router){ 
  }
  canActivate(): boolean{
    
     if( this.auth.estaAutenticado() ){ //Si está autenticado, return true
  
      return true;
     }else{
      //Controlar navegaciones
       this.router.navigateByUrl('/login'); //Que me rediriga la ruta al login
       return false;
     }
  }
  
}
