import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';

import { map} from "rxjs/operators";

@Injectable({ //No necesito importarlo en el app.module
  providedIn: 'root'
})

//En este servicio controlamos toda la autenticacion
export class AuthService {

  //Definimos la parte común de ambas URLs 
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  //La  key se obtiene de la configuracion del proyecto en firebase
  private apiKey = 'AIzaSyC9hPOEy3xwsOxARiqNMVUuCjJXBc6KC30';
  //Almacenamos si existe el idToken
  userToken: string;
  
 //Nos sirve para crear nuevos usuarios
 // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


 //Login
 //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]



  constructor( private http: HttpClient) {
    this.leerToken();
   }

  logout(){

    localStorage.removeItem('token'); //Para hacer logout lo que tenemos que hacer es destruir el token 

  }

  login( usuario: UsuarioModel){
     //Tenemos que definir el AuthToken igual que en el registro
     const authData = {
      /* email: usuario.email,
       password: usuario.password, */ 
       ...usuario, //Sinonimo a lo anterior ya que tenemos las propiedades en usuario
       returnSecureToken: true //Se tiene que inicializar siempre en true
     };

      //Hacemos la petición POST
    return this.http.post( //Sucrbimos en otro lugar
      `${ this.url }signInWithPassword?key= ${ this.apiKey }`, //url definido más el endpoint
      authData//La informacion del POST que quiero enviar
    ).pipe( //Lo podemos pasar por un pipe
      map( respuesta =>{ //Permite obtener la respuesta del POST del subscribe. Si hay un error el map no se dispara
        this.guardarToken( respuesta['idToken']); //Mandamos como respuesta el idToken
        return respuesta;
      }) 
    );


  }

  nuevoUsuario( usuario: UsuarioModel){

    //email y password ya vienen declarados dentro del usuario

    //Tenemos que definir el AuthToken
    const authData = {
     /* email: usuario.email,
      password: usuario.password, */ 
      ...usuario, //sinonimo a lo anterior ya que tenemos las propiedades en usuario
      returnSecureToken: true //Se tiene que inicializar siempre en true
    };

    //Hacemos la petición POST
    return this.http.post( //Sucrbimos en otro lugar. POST devuelve un observable
      `${ this.url }signUp?key= ${ this.apiKey }`, //url definido más el endpoint
      authData//La informacion del POST que quiero enviar
    ).pipe( //Lo podemos pasar por un pipe
      map( respuesta =>{ //Permite obtener la respuesta del POST del subscribe. Si hay un error el map no se dispara
        this.guardarToken( respuesta['idToken']); //Mandamos como respuesta el idToken
        return respuesta;
      })
    );

  }

  private guardarToken( idToken: string){

    this.userToken = idToken;
    //Almacenamos en nuestro localStorage en la propiedad llamada token. Tenemos que almacenar un string que es idToken
    localStorage.setItem('token', idToken);

    let fechaActual = new Date();
    fechaActual.setSeconds( 3600 ); //Incrementamos una hora a la fecha actual
    //Almacenamos la fecha en localStorage
    localStorage.setItem('expira', fechaActual.getTime().toString()); //Convertimos en string la fecha que expira el token

  }

  private leerToken(){
    if( localStorage.getItem('token')){ //Comprobamos si tenemos ya informacion en el token
      this.userToken = localStorage.getItem('token'); //Si existe el token lo igualamos al token que obtenemos de localStorage
    }else{
      this.userToken = ''; //Si no existe, lo inicializamos como un string vacio
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {

    if( this.userToken.length < 2){
      return false; //Vemos que el token no exite por lo que devolvemos null
    }

    //Recuperar la fecha a la que expira de localStorage 
    const expira = Number(localStorage.getItem('expira')); //Lo convertimos a numero
    const fechaExpira = new Date();
   
    fechaExpira.setTime(expira);

    if( fechaExpira > new Date()){ //Comprobamos si esa fecha es mayor en el momento actual 
      return true;
    }else{ //El token ha expirado
      return false; //Token no valido
    }
  }
}
