/*

verm - vereador
amar - apoiadores

nome
enderec

*/


var Ctrl = {
	newPerson: function(){
		var name = '';
		var address  = '';
		var color = '';
		do{
			name = prompt('Nova Pessoa\nInsira um Nome:');
		}while(!name);

		do{
			address = prompt('Nova Pessoa\nInsira um Endereço:' );
		}while(!name);

		do{
			color = prompt('Nova Pessoa\nInsira uma cor\na - amarelo\nv - vermelho' );
			color = color[0];
		}while(color !== 'v' && color !== 'a');

		var id   = (new Date()).getTime();

		var lat = Plugins.Map.list[0].center.lat();
		var lng = Plugins.Map.list[0].center.lng();

		var icon = '';//'http://maps.google.com/intl/en_us/mapfiles/ms/micons/man.png';
		if(color === 'v'){
			icon = './man-red.png';
		}else{
			icon = './man-yellow.png';
		}
		var infoHtml = Plugins.Map.Marker.Templates.person({name: name, address:address, id: id});

		Plugins.Map.Marker.add({lat: lat, lng: lng, id: id}, infoHtml, icon);
	},
	removePerson: function(id){
		var marker = Plugins.Map.Marker.list.find(function(element, index, array){
			return (id === element._pmxId);
		});

		Plugins.Map.Marker.remove(marker);
	}
}





var Plugins = {
	Map:{
		initialCoord: {lat: -22.8080266, lng: -45.1942201},
		list: [],
		start: function(divId, center, zoom){
			var mapDiv = document.getElementById(divId);
        	var map = new google.maps.Map(mapDiv, {
        	  center: Plugins.Map.coords(center),
        	  zoom: (zoom || 15)
        	});
        	this.list.push(map);
		},
		coords: function(lat, lng){
			if(typeof(lat)==="object"){
        	    lng = lat.lng;
        	    lat = lat.lat;
        	}else if(typeof(lat)==="string"){
        	    var coords = lat.split(',');
        	    lat = parseFloat(coords[0],10);
        	    lng = parseFloat(coords[1],10);
        	}
        	return new google.maps.LatLng(lat,lng);
		},
		Marker: {
			list: [],
			setMap: function(markers, map){
				var that = this;
				markers = (markers.length ? markers : [markers]);
				markers.forEach(function(marker){
					marker.setMap(map);
				});
			},
			add: function(coords, info, icon){
				var map = Plugins.Map.list[0];

				if(!icon){
					icon = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png';
				}
				var point = Plugins.Map.coords(coords);
				var marker = new google.maps.Marker({
					map: map,
					position: point,
					icon: icon,
					animation: google.maps.Animation.DROP,
					draggable: true,
					_pmxId: coords.id
				});
				if(info){
					Plugins.Map.Marker.addListeners(marker, info);
				}
				this.list.push(marker);
			},
			remove: function(markers){
				var that = this;
				markers = (markers.length ? markers : [markers]);
				
				this.hide(markers);

				markers.forEach(function(marker){
					var index = that.list.indexOf(marker);
					that.list.splice(index, 1);
				});
			},
			show: function(markers){
				var map = Plugins.Map.list[0];
				this.setMap(markers, map);
			},
			hide: function(markers){
				this.setMap(markers, null);
			},
			addListeners: function(marker, info){
				var map = Plugins.Map.list[0];

				var infowindow = new google.maps.InfoWindow({
            	    content: info
            	});
            	var infowindow2 = new google.maps.InfoWindow({
            	    content: info
            	});
            	google.maps.event.addListener(marker, 'mouseover', function() {
            	    infowindow.open(map, this);
            	});
            	google.maps.event.addListener(marker, 'mouseout', function() {
            	    infowindow.close();
            	});
            	google.maps.event.addListener(marker, 'click', function() {
            	    infowindow2.open(map, this);
				});
				google.maps.event.addListener(marker, 'dragend', function() {
            	    
            	});
			},
			Templates: {
				person: function(info){
					var html = '';
					html +=	'<div>' +
								'<b>' + info.name + '</b> <br>' +
								'<b>Endereço: </b><span>' + info.address + '</span>' +
								'<button onclick="Ctrl.removePerson('+info.id+')" style="display: block;margin-top: 20px;" >Remover</button>' +
						    '</div>';
 
				    return html;
				}
			}
		}
	}
}








function initMap() {
	Plugins.Map.start('map', Plugins.Map.initialCoord);

	Plugins.Map.Marker.add(Plugins.Map.initialCoord, 
		'<div style="text-align: center">'+  
			'<h1 style="">Guaratinguetá</h1>'+
		  '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bandeira_Guaratingueta_SaoPaulo_Brasil_2.svg/125px-Bandeira_Guaratingueta_SaoPaulo_Brasil_2.svg.png">'+
	  '</div>'
	);


	([
  	  {id: 1,lat:-22.81229721,lng:-45.20818753, color: 'red'   , name: "Antônia Quirino"		, address: "Rua A, Guaratinguetá"},
  	  {id: 2,lat:-22.82475334,lng:-45.19505379, color: 'red'   , name: "Bárbara Álvarez"		, address: "Rua B, Guaratinguetá"},
  	  {id: 3,lat:-22.80458907,lng:-45.18068995, color: 'red'   , name: "Caio César"			, address: "Rua C, Guaratinguetá"},
  	  {id: 4,lat:-22.80337842,lng:-45.19436132, color: 'red'   , name: "Domingos Araújo"		, address: "Rua D, Guaratinguetá"},
  	  {id: 5,lat:-22.81879289,lng:-45.20800073, color: 'red'   , name: "Donata Bicudo"		, address: "Rua E, Guaratinguetá"},
  	  {id: 6,lat:-22.82095194,lng:-45.19557528, color: 'red'   , name: "Felícia Coello"		, address: "Rua F, Guaratinguetá"},
  	  {id: 7,lat:-22.79395431,lng:-45.18964203, color: 'red'   , name: "Flora Leite"			, address: "Rua G, Guaratinguetá"},
  	  {id: 8,lat:-22.79736162,lng:-45.18597528, color: 'red'   , name: "Inaiá Caminha"		, address: "Rua H, Guaratinguetá"},
  	  {id: 9,lat:-22.81738825,lng:-45.20344573, color: 'red'   , name: "Jeremias Souto Maior"	, address: "Rua I, Guaratinguetá"},
  	  {id:10,lat:-22.8145951 ,lng:-45.2040942 , color: 'red'   , name: "Lara Covilhã"			, address: "Rua J, Guaratinguetá"},
  	  {id:11,lat:-22.813878  ,lng:-45.19456829, color: 'yellow', name: "Manuela Barrios"		, address: "Rua K, Guaratinguetá"},
  	  {id:12,lat:-22.80933685,lng:-45.20175266, color: 'yellow', name: "Noel Veloso"			, address: "Rua L, Guaratinguetá"},
  	  {id:13,lat:-22.81857607,lng:-45.19735738, color: 'yellow', name: "Noémia Bugalho"		, address: "Rua M, Guaratinguetá"},
  	  {id:14,lat:-22.79845418,lng:-45.18203435, color: 'yellow', name: "Ondina Duarte"		, address: "Rua N, Guaratinguetá"},
  	  {id:15,lat:-22.80824874,lng:-45.20653159, color: 'yellow', name: "Roberto Cisneiros"	, address: "Rua O, Guaratinguetá"},
  	  {id:16,lat:-22.80305207,lng:-45.18350962, color: 'yellow', name: "Tomás Cysneiros"		, address: "Rua P, Guaratinguetá"},
  	  {id:17,lat:-22.81513172,lng:-45.2025925 , color: 'yellow', name: "Trajano Carballo"		, address: "Rua Q, Guaratinguetá"},
  	  {id:18,lat:-22.81904144,lng:-45.20115135, color: 'yellow', name: "Tânia Carvalhoso"		, address: "Rua R, Guaratinguetá"},
  	  {id:19,lat:-22.8103327 ,lng:-45.18061669, color: 'yellow', name: "Vanessa Zagallo"		, address: "Rua S, Guaratinguetá"},
  	  {id:20,lat:-22.80165717,lng:-45.20064915, color: 'yellow', name: "Vasco Lima"			, address: "Rua T, Guaratinguetá"}
   ]).forEach(function(point, index){
	  setTimeout(function(){
		  var icon = 'man-' + point.color + '.png';//'http://maps.google.com/intl/en_us/mapfiles/ms/micons/man.png';
		  var infoHtml = Plugins.Map.Marker.Templates.person(point);
		  Plugins.Map.Marker.add(point, infoHtml, icon);
	  }, 50 * index);
  })


  setTimeout(() => {
  	let dismissButton = document.querySelector('.dismissButton');
  	if(dismissButton){
		dismissButton.click();
	}
  }, 2000)

}








google.maps.event.addDomListener(window, 'load', initMap);