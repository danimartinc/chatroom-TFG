import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  focus;
  focus1;
  
  usuario: UsuarioModel = new UsuarioModel();
  recuerdame = false; //boolean para recordar el usuario cuando se autentica

  constructor( private auth: AuthService, //Inyectamos el servicio
               private router: Router) { 
   }

  ngOnInit() {
    
    if( localStorage.getItem('email')){ //Si en el localSotrage existe el email
      this.usuario.email = localStorage.getItem('email');
      this.recuerdame = true; //Mantengo el recuerdame en true
    }
  }
  login( form: NgForm){

    if( form.invalid ){ //Si el form es inavlido que no haga ninguna funcion
      return;
    }

   Swal.fire({
      allowOutsideClick: false, //Prevenimos que el usuario  no puede cerrar el sweet alert si pincha fuera
      icon: 'question',
      text: 'Espere por favor...'
    });
    //Transofrma el botón en un loading
    Swal.showLoading();
   
    this.auth.login( this.usuario )
        .subscribe( respuesta =>{ //Si todo sale bien muestra respuesta si no muestra el error
          console.log(respuesta);
          Swal.close(); //Cancela el sweet alert
          
          if( this.recuerdame){ //Si está en true, guardamos en localstorage el email de usuario
            localStorage.setItem('email', this.usuario.email); //Guardo en localsotrage el email 
          }
          //A LO MEJOR HAY QUE CAMBIARLO
          //Realizo el router cuando ya tengo una autenticacion valida
          this.router.navigateByUrl('/home');

        }, (error)=>{
          console.log(error.error.error.message);
         //Para mostrar en caso de error
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error.error.error.message
          });
        });
  }
}
