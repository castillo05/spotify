import{Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {UploadService} from '../services/upload.service';
import {ArtistService} from '../services/artist.service';
import{Artist} from '../models/artist';
@Component({
	selector: 'artist-edit',
	templateUrl:'../views/artist-add.html',
	providers:[UserService ,ArtistService,UploadService]
})

export class ArtistEditComponent implements OnInit{
	public titulo:string;
	public artist: Artist;
	public identity;
	public token;
	public url:string;
	public alertmessage;
	public is_edit;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _UserService: UserService,
		private _ArtistService: ArtistService,
		private _UploadService: UploadService


	){
		this.titulo= 'Editar Artistas';
		this.identity=this._UserService.getIdentity();
		this.token= this._UserService.getToken();
		this.url=GLOBAL.url;
		this.is_edit=true;
		this.artist=new Artist('','','');
	}

	ngOnInit()
	{
		console.log('ArtistAddComponent cargado');
		//llamar al metodo del api para sacar un artista en base a su id
		this.getArtist();



	}


	getArtist(){
		this._route.params.forEach((params:Params)=>{
			let id=params['id'];
			this._ArtistService.getArtist(this.token,id).subscribe(
				
					response=>{
					
						if (!response.artist) { 
							this._router.navigate(['/']);
						} else {
								this.artist=response.artist;

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

		});
	}
	onSubmit(){
				this._route.params.forEach((params:Params)=>{
					let id=params['id'];
				this._ArtistService.EditArtist(this.token,id ,this.artist).subscribe(
					response=>{
						
						if (!response.artist) { 
							this.alertmessage=('Error en el servidor');
						} else {
							this.alertmessage=('El artista se ha actualizado correctamente');
							//this.artist=response.artist;
							//this._router.navigate(['/editar-artista']),response.artist._id);
							//Subir la imagen

							this._UploadService.makeFileRequest(this.url+'upload-image-artist/'+id,[],this.filesToUpload,this.token,'image')
							.then(
									(result)=>{
										this._router.navigate(['/artists',1]);
									},
									(error)=>{
										console.log(error);
									}
								);
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
			});
		}


			public filesToUpload: Array<File>;

		fileChangeEvent(fileInput:any){
			this.filesToUpload=<Array<File>>fileInput.target.files;
		}

}