'use strict'

var fs= require('fs');
var path= require('path');
var mongoosePaginate=require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res) {
	//res.status(200).send({message:'Metodo getArtist del controlador artist'});
	var artistId= req.params.id;

	Artist.findById(artistId, (err,artist)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!artist) {
				res.status(404).send({message:'El artista no existe'});
			}else{
				res.status(200).send({artist});	
			}
		}
	});

	// body...
}


function saveArtist(req, res) {
	// body...

	var artist= new Artist();

	var params = req.body;
	artist.name=params.name;
	artist.description=params.description;
	artist.image='null';

	artist.save((err, artistStored)=>{
		if (err) {
			res.status(500).send({message:'Error al guardar el artista'});
		}else{
			if (!artistStored) {
				res.status(404).send({message:'El artista no se ha guardado'});
			}else{
				res.status(200).send({artist: artistStored});	
			}
		}
	});
}


function getArtists(req,res) {

	if (req.params.page) {
	var page= req.params.page;	
	}else{
		var page=1;
	}
	// body...
	
	var itemPerPage= 4;

	Artist.find().sort('name').paginate(page,itemPerPage,function (err,artists,total) {
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!artists) {
				res.status(404).send({message:'No hay artistas'});
			}else{
				return res.status(200).send({
					total_items: total,
					 artists: artists

				});
			}

		}
		// body...
	});
}


function artistUpdate(req,res) {
	// body...

	var artistId=req.params.id;
	var update=req.body;

	Artist.findByIdAndUpdate(artistId, update,(err,artistUpdate)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!artistUpdate) {
				res.status(404).send({message:'No se ha podido actualizar el artista'});
			}else{

				res.status(200).send({artist: artistUpdate});

			}

		}
	});
}


function artistDelete(req,res) {
	// body...
	var artistId= req.params.id;

	Artist.findByIdAndRemove(artistId, (err,artistRemoved)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!artistRemoved) {
				res.status(404).send({message:'El artista no se ha eliminado'});
			}else{
				Album.find({artist: artistRemoved._id}).remove((err,albumRemoved)=>{
					if (err) {
						res.status(500).send({message:'Error al eliminar el artista'});
					}else{
						if (!albumRemoved) {
							res.status(404).send({message:'El album no se ha eliminado'});
						}else{
							Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
								if (err) {
									res.status(500).send({message:'Error al eliminar la cancion'});
								}else{
									if (!songRemoved) {
										res.status(404).send({message:'la cancion no se ha eliminado'});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}


//Subir imagen de artista
//
function uploadImage(req,res) {
	// body...
	var artistId= req.params.id;

	var file_name= 'No Subido...';

	if (req.files) {
		var file_path=req.files.image.path;
		var file_split=file_path.split('\\');
		var file_name=file_split[2];

		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1];

		if (file_ext=='png' || file_ext== 'jpg' || file_ext=='gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{
				if (!artistUpdate) {
					res.status(404).send({message:'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});
		}else{
			res.status(200).send({message:'Extension del archivo no valida'});
		}

		console.log(file_path);
	}else{
		res.status(200).send({message:'No has subido ninguna imagen'});
	}
}

function getImageFile(req,res) {
	// body...
	var imageFile= req.params.imageFile;
	var path_file='./uploads/artist/'+imageFile;
	fs.exists('./uploads/artist/'+imageFile,function (exists) {
		
		if (exists) {
			res.sendFile(path.resolve('./uploads/artist/'+imageFile));

		}else{
			res.status(200).send({message:'No existe la imagen'});

		}
		// body...
	});
}

module.exports={
	getArtist,
	saveArtist,
	getArtists,
	artistUpdate,
	artistDelete,
	uploadImage,
	getImageFile

}