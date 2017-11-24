'use strict'
var fs= require('fs');
var path= require('path');
var bcrypt=require('bcrypt-nodejs');
var User = require('../models/user');
var jwt =require('../service/jwt');

function pruebas(req,res) {
	// body...
	res.status(200).send({
		//No poner punto y coma al final de un mmessaje
		message:'Probando una accion del controlador usuario'
	});
}

function saveUser(req,res) {
	var user = new User();

	var params= req.body;

	console.log(params);

	user.name=params.name;
	user.surname=params.surname;
	user.email=params.email;
	user.role='ROLE_USER';
	user.image='null';
	// body...
	if (params.password) {
		bcrypt.hash(params.password,null,null, function (err,hash) {
			user.password=hash;
			if (user.name!= null && user.surname!=null && user.email !=null) {
				user.save((err,userStored)=>{
					if (err) {
						res.status(500).send({message:'Error al guardar los datos'});
					}else {
						if (!userStored) {
							res.status(404).send({message:'No se ha registrado el usuario'});

						}else{
							res.status(200).send({user:userStored});
						}
					}
				});
			}else{
				res.status(200).send({message:'Rellena todos los campos'});
			}

			// body...
		});
	}else{
		res.status(200).send({message:'Introduce la contraseña'});

	}
}

function loginUser(req,res){
	var params= req.body;

	console.log(params);
	var email=params.email;
	var password=params.password;

	User.findOne({email: email.toLowerCase()},(err,user)=>{
		if (err) {
			res.status(500).send({message:'Error en la peticion'});

		}else{
			if (!user) {
				res.status(404).send({message:'El usuario no existe'});

			}else{
				//comprobar la contrase;a
				bcrypt.compare(password,user.password,function(arr,check){
					if (check) {
						//Devolver los datos
						if (params.gethash) {
							//devolver un tokens jwt
							res.status(200).send({token: jwt.createToken(user)});


						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message:'El usuario no ha podido logearse'});

					}
				});

			}
		}
	});
}


function updateUser(req,res) {
	// body...
	var userId=req.params.id;

	var update= req.body;
	if (userId != req.user.sub) {
		return res.status(500).send({message:'Error al actualizar el usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else{
			if (!userUpdated) {
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}


function uploadImage(req,res) {
	// body...
	var userId= req.params.id;

	var file_name= 'No Subido...';

	if (req.files) {
		var file_path=req.files.image.path;
		var file_split=file_path.split('\\');
		var file_name=file_split[2];

		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1];

		if (file_ext=='png' || file_ext== 'jpg' || file_ext=='gif'){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
				if (!userUpdated) {
					res.status(404).send({message:'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name,user: userUpdated});
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
	var path_file='./uploads/users/'+imageFile;
	fs.exists('./uploads/users/'+imageFile,function (exists) {
		
		if (exists) {
			res.sendFile(path.resolve('./uploads/users/'+imageFile));

		}else{
			res.status(200).send({message:'No existe la imagen'});

		}
		// body...
	});
}

//Listar Usuarios 
function getUsers(req,res) {
	// body...
	if (req.params.body) {
		var page=req.params.page;
	}
	else{
		var page=1;
	}

	var itemPerPage=3;

	User.find().sort('name').paginate(page,itemPerPage,function (err,users,total) {
		// body...
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if (!users) {
				res.status(404).send({message:'No hay Usuarios'});
			}else{
				res.status(200).send({
					total_items:total,
					users:users
				});
			}
		}
	});
}

module.exports={
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile,
	getUsers
	

};