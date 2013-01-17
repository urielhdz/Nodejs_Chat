$(document).on('ready',function(){
	var is_visible = false;
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/clouds");
	editor.getSession().setMode("ace/mode/javascript");
	editor.resize();
	
	$('#abrirChat').on('click',function(){
		if(is_visible){
			$('#chat').slideUp('slow');
			is_visible = false;
		}
		else{
			$('#chat').slideDown('slow');	
			is_visible = true;
		}
	});
});