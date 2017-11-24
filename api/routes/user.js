'use strict'

var express= require('express');

var UserController=require('../controller/user');


var api = express.Router();
var md_auth=require('../midelware/authenticated');

var multipart=require('connect-multiparty');

var md_upload= multipart({ uploadDir: './uploads/users'});

api.get('/Probando-controlador',md_auth.ensureAuth, UserController.pruebas);

api.post('/register', UserController.saveUser);

api.post('/login',UserController.loginUser);

api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);

api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage); 
api.get('/get-image-user/:imageFile',UserController.getImageFile); 

//Mostrar Usuario
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
module.exports=api;	