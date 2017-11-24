import{Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import  {GLOBAL} from './global';
import{Artist} from '../models/artist';
import {RequestOptions, Request, RequestMethod} from '@angular/http';

@Injectable()
export class ArtistService{
	public url: string;
	

	constructor(private _http: Http){
		this.url=GLOBAL.url;

	}


	AddArtist(token, artist:Artist){
		let params= JSON.stringify(artist);
		let headers=new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.post(this.url+'artist',params,{headers:headers})
		.map(res=>res.json());

	}


	EditArtist(token, id:string,artist:Artist){
		let params= JSON.stringify(artist);
		let headers=new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.put(this.url+'artist-update/'+id,params,{headers:headers})
		.map(res=>res.json());

	}


	getArtists(token,page){
		let headers=new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers:headers});
		return this._http.get(this.url+'artists/'+page,options)
		.map(res=>res.json());
	}

	getArtist(token,id:string){
		let headers=new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers:headers});
		return this._http.get(this.url+'artist/'+id,options)
		.map(res=>res.json());
	}


	deleteArtist(token,id:string){
		let headers=new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers:headers});
		return this._http.delete(this.url+'artist/'+id,options)
		.map(res=>res.json());
	}

}