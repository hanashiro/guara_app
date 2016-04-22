var Ctrl = {
	newPerson: function(){
		var name = prompt('Nova Pessoa\nInsira um Nome:');
		var cpf  = prompt('Nova Pessoa\nInsira um CPF:' );
		var id   = (new Date()).getTime();

		var lat = Plugins.Map.list[0].center.lat();
		var lng = Plugins.Map.list[0].center.lng();

		var icon = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/man.png';
		var infoHtml = Plugins.Map.Marker.Templates.person({name: name, cpf:cpf, id: id});

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
			},
			Templates: {
				person: function(info){
					var html = '';
					html +=	'<div>' +
								'<b>' + info.name + '</b> <br>' +
								'<b>CPF: </b><span>' + info.cpf + '</span>' +
								'<button onclick="Ctrl.removePerson('+info.id+')" style="display: block;margin-top: 20px;" >Remover</button>' +
						    '</div>';
 
				    return html;
				}
			}
		}
	}
}