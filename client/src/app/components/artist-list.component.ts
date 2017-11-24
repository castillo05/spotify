import{Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import{Artist} from '../models/artist';
@Component({
	selector: 'artist-list',
	templateUrl:'../views/artist-list.html',
	providers:[UserService,ArtistService]
})

export class ArtistListComponent implements OnInit{
	public titulo:string;
	public artists: Artist[];
	public identity;
	public token;
	public url:string;
	public next_page;
	public prev_page;
	public alertmessage;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _UserService: UserService,
		private _ArtistService:ArtistService

	){
		this.titulo= 'Artistas';
		this.identity=this._UserService.getIdentity();
		this.token= this._UserService.getToken();
		this.url=GLOBAL.url;
		this.next_page=1;
		this.prev_page=1;
	}

	ngOnInit()
	{
		console.log('ArtistLisComponent cargado');
		//Consegur el listado de artista
		this.getArtists();

	}

	getArtists(){
		this._route.params.forEach((params:Params)=>{
			let page= +params['page'];
			if (!page) {
				page=1;
			}else{
				this.next_page=page+1;
				this.prev_page=page-1;

				if (this.prev_page==0) {
					this.prev_page=1;
				}
			}
				this._ArtistService.getArtists(this.token,page).subscribe(
						response=>{
					
								if (!response.artists) { 
									this._router.navigate(['/']);
								} else {
										this.artists=response.artists;

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

}