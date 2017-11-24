'use strict'

var express= require('express');

var AlbumController=require('../controller/album');

var api=express.Router();

var md_auth= require('../midelware/authenticated');

var multipart=require('connect-multiparty');

var md_upload= multipart({ uploadDir: './uploads/albums'});

api.get('/album/:id',md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album',md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:page?',md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album-update/:id',md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id',md_auth.ensureAuth, AlbumController.deleteAlbum);

//ruta para subir imagen a artista
api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.imageUpload);
api.get('/get-image-album/:imageFile',AlbumController.getImage); 
module.exports=api;