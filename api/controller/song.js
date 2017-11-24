'use strict'

var fs= require('fs');
var path= require('path');
var mongoosePaginate=require('mongoose-Pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveSong(req,res) {
	//res.status(200).send({message:'Controlador de song en funcionamiento'});
	var song=new Song();
	var params= req.body;
	song.number=params.number;
	song.name=params.name;
	song.duration=params.duration;
	song.file='null';
	song.album=params.album;

	song.save((err,songStored)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!songStored) {
				res.status(404).send({message:'No se guardo la cancion'});
			}
			else{
				res.status(200).send({song: songStored});
			}
		}
	});
	
}

/*Mostrar songs*/
function getSongs(req,res) {
	if (req.params.page) {
		var page=req.params.page;
	} else {
		var page=1;
	}

	var itemPerPage=3;
	Song.find().sort('name').paginate(page,itemPerPage,function (err,songs,total){
		
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!songs) {
				res.status(404).send({message:'No hay canciones'});
			} else {
				res.status(200).send({
					total_items:total,
					songs:songs
				});
			}
		}
	});
}

/*Conseguir cancion*/
function getSong(req,res) {
	var songId=req.params.id;
	Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
		if (err) {
			res.status(505).send({message:'Error en la peticion'});
		} else {
			if (!song) {
				res.status(404).send({message:'La cancion no existe'});
			} else {
				res.status(200).send({song});
			}
		}
	});
}

/*Actualizar Song*/
function updateSong(req,res) {
	var songId=req.params.id;
	var update=req.body;

	Song.findByIdAndUpdate(songId,update,(err,songUpdated)=>{
		if (err) {
			res.status(505).send({message:'Error en la peticion'});
		} else {
			if (!songUpdated) {
				res.status(404).send({message:'No se ha actualizado la cancion'});
			} else {
				res.status(200).send({song: songUpdated});
			}
		}
	});

}

/*Eliminar Cancion*/
function deleteSong(req,res) {
	var songId=req.params.id;

	Song.findByIdAndRemove(songId,(err,songRemoved)=>{
		if (err) {
			res.status(505).send({message:'Error en la peticion'});
		} else {
			if (!songRemoved) {
				res.status(404).send({message:'No se encontro la cancion'});
			} else {
				res.status(505).send({song: songRemoved});
			}
		}
	});
}


/*Subir imagen de album*/

function uploadFile(req,res) {
	var songId=req.params.id;
	var file_name='no Subido...'

	if (req.files) {
		var file_path=req.files.file.path;
		var file_split=file_path.split('\\');
		var file_name=file_split[2];

		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1];

		if (file_ext=='mp3' || file_ext=='ogg') {
			Song.findByIdAndUpdate(songId,{file:file_name},(err,songUpdated)=>{
				if (err) {
					res.status(505).send({message:'Error en la peticion'});
				}else{
					if (!songUpdated) {
						res.status(404).send({message:'No se ha subido ninguna imagen'});
					}else{
						res.status(200).send({song:songUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extension no valida'});
		}
	}else{
		res,status(200).send({message:'No ha subido ningun archivo'});
	}
}


/*Ver Imagen de album*/

function getsongFile(req,res) {
	var songFile=req.params.songFile;
	var path_file='./uploads/songs/'+songFile;
	fs.exists('./uploads/songs/'+songFile,function (exists) {
		if (exists) {
			res.sendFile(path.resolve('./uploads/songs/'+songFile));
		}else{
			res.status(200).send({message:'No existe la imagen'+songFile});
		}
	});
}



module.exports={
	saveSong,
	getSongs,
	getSong,
	updateSong,
	deleteSong,
	getsongFile,
	uploadFile
}