import{Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import{Artist} from '../models/artist';
@Component({
	selector: 'artist-add',
	templateUrl:'../views/artist-add.html',
	providers:[UserService ,ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo:string;
	public artist: Artist;
	public identity;
	public token;
	public url:string;
	public alertmessage;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _UserService: UserService,
		private _ArtistService: ArtistService


	){
		this.titulo= 'Crear Artistas';
		this.identity=this._UserService.getIdentity();
		this.token= this._UserService.getToken();
		this.url=GLOBAL.url;
		this.artist=new Artist('','','');
	}

	ngOnInit()
	{
		console.log('ArtistAddComponent cargado');
		//Consegur el listado de artista
		



	}
	onSubmit(){
		this._ArtistService.AddArtist(this.token,this.artist).subscribe(
			response=>{
				
				if (!response.artist) { 
					this.alertmessage=('Error en el servidor');
				} else {
					this.alertmessage='El artista se ha creado correctamente';
					this.artist=response.artist;
					this._router.navigate(['/editar-artista',response.artist._id]);
				}
			},
			error=>{
					var errorMessage = <any>error;

	                var body = JSON.parse(error._body);
	                this.alertmessage = body.message;
	                if (errorMessage !=null) { 
					this.alertmessage=body.message; 
					console.log(error);
					}
				}
			);

	}



}