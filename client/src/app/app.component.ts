import { Component,OnInit } from '@angular/core';
import {UserService} from './services/user.service';
import { User } from './models/user';
import {GLOBAL} from './services/global';
import {Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent implements OnInit {
 public title = 'Spofity';
 public user: User;
 public user_register:User;
 public identity;
 public token;
 public errorMessage;
 public alertRegister;
 public url:string;

 constructor(private _userService:UserService,private _route: ActivatedRoute,
		private _router: Router,)
 	{

 	this.user = new User('','','','','','ROLE_USER','');
 	this.user_register = new User('','','','','','ROLE_USER','');
	this.url= GLOBAL.url;
	}
//Extraemos el token y el identity de el usuario logeado.
	ngOnInit(){
		this.identity=this._userService.getIdentity();
		this.token=this._userService.getToken();

		console.log(this.identity);
		console.log(this.token);
		//console.log(this.url+'get-image-user/'+this.identity.image);

	}
public onSubmit(){
	//console.log(this.user);
	//Conseguir los datos del usuario identificado
	this._userService.signup(this.user).subscribe(
		response=>{
			let identity=response.user;
			this.identity=identity;
			if (!this.identity._id) {
				alert('El usuario no esta correctamente logeado!');
			}else{
				//Crear elemento en el localstorage para tener al usuario sesion

				localStorage.setItem('identity',JSON.stringify(identity));
				//Conseguir el token para enviarselo a cada peticion http

								this._userService.signup(this.user,'true').subscribe(
						response=>{
							let token=response.token;
							this.token=token;
							if (this.token.Length<=0) {
								alert('El token no se ha generado!');
							}else{
								//Crear elemento en el localstorage para tener el token disponible
								localStorage.setItem('token',token);
								/*console.log(token);
								console.log(identity);*/
								this.user = new User('','','','','','ROLE_USER','');
							}
						},
						error=>{
							var errorMessage=<any>error;
							var body=JSON.parse(error._body);
							if (errorMessage !=null) { 
								this.errorMessage=body.message; 
								console.log(error);
							}
						}
						);	
								//****************

			}
		},
		error=>{
			var errorMessage=<any>error;
			var body=JSON.parse(error._body);
			if (errorMessage !=null) { 
				this.errorMessage=body.message; 
				console.log(error);
			}
		}
		);	
}

	logout(){
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.clear();
		this.identity=null;
		this.token=null;
		this._router.navigate(['/']);
	}

	
	onSubmitRegister(){
        console.log(this.user_register);
        this._userService.register(this.user_register).subscribe(
            response => {
                let user = response.user;
                this.user_register = user;
                if (!user._id) {
                    this.alertRegister='Error al registrarse';

                }else{
                	this.alertRegister='El registro se ha realizado satisfactoriamente, identificate con '+this.user_register.email;
                	this.user_register = new User('','','','','','ROLE_USER','');

                }
            },
            error => {
                var errorMessage = <any>error;

                var body = JSON.parse(error._body);
                this.alertRegister = body.message;
                if (errorMessage !=null) { 
				this.alertRegister=body.message; 
				console.log(error);
				}
                
            }

	)};

}
