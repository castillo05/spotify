'use strict'


var express= require('express');

var SongController=require('../controller/song');

var api=express.Router();

var md_auth= require('../midelware/authenticated');

var multipart=require('connect-multiparty');

var md_upload= multipart({ uploadDir: './uploads/songs'});

api.get('/song/:id',md_auth.ensureAuth, SongController.getSong);
api.post('/song',md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:page?',md_auth.ensureAuth, SongController.getSongs);
api.put('/song-update/:id',md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth, SongController.deleteSong);

//ruta para subir imagen a artista
api.post('/upload-song/:id',[md_auth.ensureAuth,md_upload],SongController.uploadFile);
api.get('/get-song/:songFile',SongController.getsongFile); 
module.exports=api;