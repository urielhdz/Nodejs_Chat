var express = require('express'),http = require('http');
var app = express();
var server = http.createServer(app);
app.set('views',__dirname + '/views');
app.configure(function(){
	app.use(express.static(__dirname));
});
app.get('/',function(req,res){
	res.render('index.jade',{layout:false});
});
var port = process.env.PORT || 5000;
server.listen(port);

var io = require("socket.io").listen(server);
//JSON para controlar que no se repitan nombres
var usuariosConectados = {};
io.sockets.on("connection",function(socket)
	{
		//Recibimos el nombre
		socket.on("enviarNombre",function(dato)
		{
			//Verificamos que ese nombre no existe
			if(usuariosConectados[dato])
			{
				socket.emit("errorName");
			}
			else
			{
				//Lo asignamos a la socket y lo agregamos
				socket.nickname = dato;
				usuariosConectados[dato] = socket.nickname;
				console.log(socket.nickname);
			}
			data = [dato,usuariosConectados];
			//Enviamos los datos de regreso a las sockets
			io.sockets.emit("mensaje",data);
		});	
		//Recibimos un nuevo msj y lo mandamos a todas las sockets
		socket.on("enviarMensaje",function(mensaje)
		{
			var data = [socket.nickname, mensaje];
			io.sockets.emit("newMessage",data);
		});
		//Se dispara cuando una socket se desconecta
		socket.on('disconnect', function () 
		{
			//Eliminamos al usuario de lso conectados
			delete usuariosConectados[socket.nickname];
			//Creamos un arreglo con los usuarios y el que se eliminó
			data = [usuariosConectados,socket.nickname];
			console.log(data);
			//Mandamos la información a las Sockets
			io.sockets.emit("usuarioDesconectado",data);
		});
	});