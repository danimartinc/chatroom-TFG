import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
   //Template
    test : Date = new Date();
    focus;
    focus1;
    focus2;
    //Instancia de Usuario Model
    usuario: UsuarioModel;
    recuerdame: false;


  constructor( private _authService: AuthService, //Inyectamos el servicio de nuestro usuario
               private router: Router) { 

   }

  ngOnInit() {
    //Inicializo el usuario
    this.usuario = new UsuarioModel();
    //this.usuario.email = 'damakur@gmail.com';
   }

   onSubmit( form: NgForm ){

    if(form.invalid){ //Si el formulario no es válido me salgo, no lo imprime
      return;
    }

    Swal.fire({
      allowOutsideClick: false, //Prevenimos que la persona no puede cerrar el sweet alert si pincha fuera
      icon: 'question',
      text: 'Espere por favor...'
    });

    Swal.showLoading();

    this._authService.nuevoUsuario( this.usuario )
        .subscribe( respuesta => {
          console.log(respuesta);
          Swal.close();
              
          if( this.recuerdame){ //Si está en true, guardamos en localstorage el email de usuario
            localStorage.setItem('email', this.usuario.email); //Guardo en localsotrage el email 
          }
          //A LO MEJOR HAY QUE CAMBIARLO
          //Realizo el router cuando ya tengo una autenticacion valida
          this.router.navigateByUrl('/home');

        },(error) =>{
          console.log(error.error.error.message);
          //Para mostrar en caso de error
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error.error.error.message
          });
        }); //Respuesta de firebase
  
   }
}
