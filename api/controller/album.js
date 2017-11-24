'use strict'

var path= require('path');
var fs= require('fs');
var mongoosePaginate = require('mongoose-Pagination');

var Artist=require('../models/artist');
var Album=require('../models/album');
var Song=require('../models/song');
//Mostrar Albums
function getAlbums(req,res) {
	// body...
	if (req.params.page) {
		var page=req.params.page;
	} else {
		var page=1;
	}

	var itemPerPage=3;

	Album.find().sort('title').paginate(page,itemPerPage,function (err,albums,total){
		// body...
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!albums) {
				res.status(404).send({message:'No hay albums'});
			} else {
				res.status(200).send({
					total_items:total,
					albums:albums
				});

			}
		}
	});
}


//Guardar Album
function saveAlbum(req, res) {
	// body...
	var album=new Album();
	var params=req.body;

	album.title=params.title;
	album.description=params.description;
	album.year=params.year;
	album.image='null';
	album.artist=params.artist;

	album.save((err,albumStored)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else {
			if (!albumStored) {
				res.status(404).send({message:'No se ha guardado el album'});
			}else {
				res.status(200).send({album: albumStored});
				
			}
		}
	});
}
/*Mostrar album */
function getAlbum(req,res) {
	// body...
	
	var albumId=req.params.id;

	Album.findById(albumId,(err,album)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!album) {
				res.status(404).send({message:'El Album no existe'});
			} else {
				res.status(200).send({album});

			}
		}
	});
}

/*Actualizar album*/

function updateAlbum(req,res) {
	var albumId=req.params.id;
	var update= req.body;


	Album.findByIdAndUpdate(albumId, update,(err,albumUpdated)=>{
		if (err) {
			res.status(505).send({message:'Error en la peticion'});
		}else{
			if (!albumUpdated) {
				res.status(404).send({message:'No se actualizo en album'});
			}else{
				res.status(200).send({album: albumUpdated});

			}
		}
	});
}


/*Borrar Album*/

function deleteAlbum(req,res) {
	var albumId=req.params.id;

	Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
		if (err) {
			res.status(505).send({message:'Error en la peticion'});
		}else{
			if (!albumRemoved) {
				res.status(404).send({message:'No se elimino el album'});
			}else{
				Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
					if (err) {
						res.status(505).send({message:'Error en la peticion'});
					}else{
						if (!songRemoved) {
							res.status(404).send({message:'No se elimino la cancion'});
						}else{
							res.status(200).send({
								album: albumRemoved

							});
						}
					}
				});
			}

		}
	});
}

/*Subir imagen de album*/

function imageUpload(req,res) {
	var albumId=req.params.id;
	var file_name='no Subido...'

	if (req.files) {
		var file_path=req.files.image.path;
		var file_split=file_path.split('\\');
		var file_name=file_split[2];

		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1];

		if (file_ext=='png' || file_ext=='gif' || file_ext=='jpg') {
			Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdated)=>{
				if (err) {
					res.status(505).send({message:'Error en la peticion'});
				}else{
					if (!albumUpdated) {
						res.status(404).send({message:'No se ha subido ninguna imagen'});
					}else{
						res.status(200).send({album:albumUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extension no valida'});
		}
	}else{
		res,status(200).send({message:'No ha subido ninguna imagen'});
	}
}


/*Ver Imagen de album*/

function getImage(req,res) {
	var imageFile=req.params.imageFile;
	var path_image='./uploads/albums/'+imageFile;
	fs.exists('./uploads/albums/'+imageFile,function (exists) {
		if (exists) {
			res.sendFile(path.resolve('./uploads/albums/'+imageFile));
		}else{
			res.status(200).send({message:'No existe la imagen'+imageFile});
		}
	});
}

module.exports={
	getAlbum,
	saveAlbum,
	getAlbums,
	getAlbum,
	updateAlbum,
	deleteAlbum,
	imageUpload,
	getImage
}
