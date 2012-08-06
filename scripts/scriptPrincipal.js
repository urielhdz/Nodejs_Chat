var nombre,pswd,ip;
var arrayNames = {};
var websocket = io.connect();

$(document).on("ready",iniciar);

function iniciar()
{
	$("#body").css({height:screen.height,width:screen.width});
	$("#formNombre").on("submit",function(e){
		//Cuando enviamos el nombre
		e.preventDefault();
		var bandera = 0;
		//Verificamos que el nombre no esté ocupado
		for (var i = arrayNames.length - 1; i >= 0; i--) {
			if($("#name").val() == arrayNames)
			{
				bandera = 1;
			}
		};
		if(bandera == 0)
			sendName()
		else
			alert("Ese nombre ya existe");
	});
	//Formulario para enviar un nuevo mensaje
	$("#formMsg").on("submit",function(e){
		e.preventDefault();
		sendMessage();
	});
	//Cerramos sesión
	$('#btnClosSes').on("click",function(){
		localStorage.removeItem("nombreChatUsuario");
		location.reload(true);
	});	
	//Manejamos lo que el servidor nos manda
	websocket.on("mensaje",procesarUsuario);
	websocket.on("newMessage",procesarMensaje);
	websocket.on("usuarioDesconectado",procesarUsuarios);
	websocket.on("errorName",repetirNombre);
}
//Enviamos nuestro nombre
function sendName()
{
	nombre = $("#name").val();
	$('#setNombre').fadeOut();
	//Guardamos el nombre en localStorage
	if (localStorage)
	{
		localStorage.nombreChatUsuario = nombre;
	}
	websocket.emit("enviarNombre",nombre);
}
//Enviar el mensaje
function sendMessage()
{
	var msg = $("#msg").val();
	//Verificamos que no tenga scripts
	if((msg.indexOf("<") != -1))
	{
		alert("Mensaje incorrecto");
	}
	else if((msg.indexOf(">") != -1))
	{
		alert("Mensaje incorrecto");	
	}
	else if((msg.indexOf(";") != -1))
	{
		alert("Mensaje incorrecto");
	}
	else
	{
		//Limpiamos la caja del formulario		
		$("#msg").val("");
		//Enviamos un mensaje
		websocket.emit("enviarMensaje",msg);	
	}
	
}
function procesarUsuario(mensaje)
{
	//Esta función se ejecuta cuando el servidor nos avisa
	//que alguien se conectó
	//Limpiamos el div de usuarios
	$('#users').html(""); 
	//Colocamos de nuevo los usuarios
	for (i in mensaje[1])
  	{
  		$('#users').append($('<p>').text(mensaje[1][i]));
  		arrayNames[i] = mensaje[1][i];
  	}
}
//Esta función procesa los msjs
function procesarMensaje(data)
{
	$('#chatInsite').append($('<p>').append($('<article>').html('<span>'+ data[0] + " says:</span> " + data[1])));
	$('#chat').animate({scrollTop: $("#chatInsite").height()}, 800);
}

function procesarUsuarios(data)
{
	//Esta función se ejecuta cuando el servidor nos
	//avisa que alguien se desconectó
	$('#users').html("");
	for (i in data[0])
  	{
  		$('#users').append($('<p>').text(data[0][i]));
  		arrayNames[i] = data[0][i];
  	}
}
function repetirNombre()
{
	localStorage.removeItem("nombreChatUsuario");
	alert("El nombre ya está ocupado, escoge otro");
	location.reload(true);	
}