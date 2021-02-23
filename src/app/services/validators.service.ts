import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

//Nos creamos una interface para no definir los argumentos como tipo any
interface ErrorValidate {
  [ s: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  existeUsuario( control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate>{

    if( !control.value){ //Si no existe el valor 
      return Promise.resolve(null); //Promesa resuelta inmediatamente
    }
    
    return new Promise( (resolve, reject) => {

      setTimeout(() => { //Funcion asincrona

        if ( control.value === 'strider'){ //Si marca strider ya existe el usuario por lo que mostramos un error
          resolve({ existe: true });
        }else{
          resolve( null ); //La validacion pasa 
        }
      }, 3500);

    });

  }


//Creamos una validación personalizada para indicar que el apellido nunca puede ser Herrera
  noHerrera( control: FormControl ): ErrorValidate {

  //Tenemos que devolver un objeto si la validacion del return no se cumple
    if( control.value?.toLowerCase() === 'herrera'){
      return{
        noHerrera: true
      }
    }

    return null;
  }

  passwordsIguales( password1Name: string, password2Name: string){

    return ( formGroup: FormGroup) => {

      const password1Control = formGroup.controls[password1Name];
      const password2Control = formGroup.controls[password2Name];

      if( password1Control.value === password2Control.value){ //Si las contraseñas introducidas coinciden
         password2Control.setErrors(null); //Devolvemos nulo porque todo esta bien
      }else{
        password2Control.setErrors({ noEsIgual: true});

      }
    }

  }
}
