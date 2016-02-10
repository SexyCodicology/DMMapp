// Enable the visual refresh
google.maps.visualRefresh = true;

var MapsLib = MapsLib || {};
var MapsLib = {

	//Setup section - put your Fusion Table details here
	//Using the v1 Fusion Tables API. See https://developers.google.com/fusiontables/docs/v1/migration_guide for more info

	//the encrypted Table ID of your Fusion Table (found under File => About)
	//NOTE: numeric IDs will be depricated soon
	fusionTableId: "1XGtRdaOjUtOuV9ZBPekRy2eYaYJTbeeYAu_doLY",

	//*New Fusion Tables Requirement* API key. found at https://code.google.com/apis/console/
	//*Important* this key is for demonstration purposes. please register your own.
	googleApiKey: "AIzaSyB10B0ZeIlBE7J7Ax7C5tBpUykDdloiMV4",

	//name of the location column in your Fusion Table.
	//NOTE: if your location column name has spaces in it, surround it with single quotes
	//example: locationColumn:     "'my location'",
	locationColumn: "Coordinates",

	map_centroid: new google.maps.LatLng(48.76034594263708, 8.609468946875056), //center that your map defaults to
	locationScope: "", //geographical area appended to all address searches
	recordName: "library", //for showing number of results
	recordNamePlural: "libraries",

	searchRadius: 15000, //in meters ~ 1/2 mile
	defaultZoom: 5, //zoom level when map is loaded (bigger is more zoomed in)
	addrMarkerImage: 'none',
	currentPinpoint: null,

	initialize: function () {
		$("#result_count").html("");

		geocoder = new google.maps.Geocoder();
		var myOptions = {
			zoom: MapsLib.defaultZoom,
			center: MapsLib.map_centroid,
			mapTypeControl: false,
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.STREET
		};
		// declering looks
		var style = [{
			"featureType": "administrative",
			"elementType": "all",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
				"color": "#bfbfbf"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#ebebeb"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}, {
				"color": "#006699"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}];
		map = new google.maps.Map($("#map_canvas")[0], myOptions);
		var styledMapType = new google.maps.StyledMapType(style, {
			map: map,
			name: 'Styled Map'
		});
		map.mapTypes.set('map-style', styledMapType);
		map.setMapTypeId('map-style');
		// maintains map centerpoint for responsive design
		google.maps.event.addDomListener(map, 'idle', function () {
			MapsLib.calculateCenter();
		});

		google.maps.event.addDomListener(window, 'resize', function () {
			map.setCenter(MapsLib.map_centroid);
		});

		MapsLib.searchrecords = null;

		//reset filters
		$("#search_address").val(MapsLib.convertToPlainString($.address.parameter('address')));
		var loadRadius = MapsLib.convertToPlainString($.address.parameter('radius'));
		if (loadRadius != "") $("#search_radius").val(loadRadius);
		else $("#search_radius").val(MapsLib.searchRadius);
		$(":checkbox").prop("checked", "checked");
		$("#result_box").hide();

		//-----custom initializers-------
		$("#text_search").val("");
		$("#nation_search").val("");
		$("#city_search").val("");
		//-----end of custom initializers-------

		//run the default search
		MapsLib.doSearch();
	},

	doSearch: function (location) {
		MapsLib.clearSearch();
		var address = $("#search_address").val();
		MapsLib.searchRadius = $("#search_radius").val();

		var whereClause = MapsLib.locationColumn + " not equal to ''";

		//-----custom filters-------
		var text_search = $("#text_search").val().replace("'", "\\'");
		if (text_search != '')
			whereClause += " AND 'Library' contains ignoring case '" + text_search + "'";

		var nation_search = $("#nation_search").val().replace("'", "\\'");
		if (nation_search != '')
			whereClause += " AND 'Nation' contains ignoring case '" + nation_search + "'";

		var city_search = $("#city_search").val().replace("'", "\\'");
		if (city_search != '')
			whereClause += " AND 'City' contains ignoring case '" + city_search + "'";
		//-------end of custom filters--------

		if (address != "") {
			if (address.toLowerCase().indexOf(MapsLib.locationScope) == -1)
				address = address + " " + MapsLib.locationScope;

			geocoder.geocode({
				'address': address
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					MapsLib.currentPinpoint = results[0].geometry.location;

					$.address.parameter('address', encodeURIComponent(address));
					$.address.parameter('radius', encodeURIComponent(MapsLib.searchRadius));
					map.setCenter(MapsLib.currentPinpoint);
					map.setZoom(10);

					MapsLib.addrMarker = new google.maps.Marker({
						position: MapsLib.currentPinpoint,
						map: map,
						icon: MapsLib.addrMarkerImage,
						animation: google.maps.Animation.DROP,
						title: address
					});

					whereClause += " AND ST_INTERSECTS(" + MapsLib.locationColumn + ", CIRCLE(LATLNG" + MapsLib.currentPinpoint.toString() + "," + MapsLib.searchRadius + "))";

					MapsLib.drawSearchRadiusCircle(MapsLib.currentPinpoint);
					MapsLib.submitSearch(whereClause, map, MapsLib.currentPinpoint);
				} else {
					alert("We could not find your address: " + status);
				}
			});
		} else { //search without geocoding callback
			MapsLib.submitSearch(whereClause, map);
		}
	},

	submitSearch: function (whereClause, map, location) {
		//get using all filters
		//NOTE: styleId and templateId are recently added attributes to load custom marker styles and info windows
		//you can find your Ids inside the link generated by the 'Publish' option in Fusion Tables
		//for more details, see https://developers.google.com/fusiontables/docs/v1/using#WorkingStyles

		MapsLib.searchrecords = new google.maps.FusionTablesLayer({
			query: {
				from: MapsLib.fusionTableId,
				select: MapsLib.locationColumn,
				where: whereClause
			},
			styleId: 2,
			templateId: 2
		});
		MapsLib.searchrecords.setMap(map);
		MapsLib.getCount(whereClause);
	},

	clearSearch: function () {
		if (MapsLib.searchrecords != null)
			MapsLib.searchrecords.setMap(null);
		if (MapsLib.addrMarker != null)
			MapsLib.addrMarker.setMap(null);
		if (MapsLib.searchRadiusCircle != null)
			MapsLib.searchRadiusCircle.setMap(null);
	},

	findMe: function () {
		// Try W3C Geolocation (Preferred)
		var foundLocation;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				foundLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				MapsLib.addrFromLatLng(foundLocation);
			}, null);
		} else {
			alert("Sorry, we could not find your location.");
		}
	},

	addrFromLatLng: function (latLngPoint) {
		geocoder.geocode({
			'latLng': latLngPoint
		}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					$('#search_address').val(results[1].formatted_address);
					$('.hint').focus();
					MapsLib.doSearch();
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	},

	drawSearchRadiusCircle: function (point) {
		var circleOptions = {
			strokeColor: "#4b58a6",
			strokeOpacity: 0.3,
			strokeWeight: 1,
			fillColor: "#4b58a6",
			fillOpacity: 0.05,
			map: map,
			center: point,
			clickable: false,
			zIndex: -1,
			radius: parseInt(MapsLib.searchRadius)
		};
		MapsLib.searchRadiusCircle = new google.maps.Circle(circleOptions);
	},

	query: function (selectColumns, whereClause, callback) {
		var queryStr = [];
		queryStr.push("SELECT " + selectColumns);
		queryStr.push(" FROM " + MapsLib.fusionTableId);
		queryStr.push(" WHERE " + whereClause);

		var sql = encodeURIComponent(queryStr.join(" "));
		$.ajax({
			url: "https://www.googleapis.com/fusiontables/v1/query?sql=" + sql + "&callback=" + callback + "&key=" + MapsLib.googleApiKey,
			dataType: "jsonp"
		});
	},

	handleError: function (json) {
		if (json["error"] != undefined) {
			var error = json["error"]["errors"];
			console.log("Error in Fusion Table call!");
			for (var row in error) {
				console.log(" Domain: " + error[row]["domain"]);
				console.log(" Reason: " + error[row]["reason"]);
				console.log(" Message: " + error[row]["message"]);
			}
		}
	},

	getCount: function (whereClause) {
		var selectColumns = "Count()";
		MapsLib.query(selectColumns, whereClause, "MapsLib.displaySearchCount");
	},

	displaySearchCount: function (json) {
		MapsLib.handleError(json);
		var numRows = 0;
		if (json["rows"] != null)
			numRows = json["rows"][0];

		var name = MapsLib.recordNamePlural;
		if (numRows == 1)
			name = MapsLib.recordName;
		$("#result_box").fadeOut(function () {
			$("#result_count").html(MapsLib.addCommas(numRows) + " " + name + " found");
		});
		$("#result_box").fadeIn();
	},

	addCommas: function (nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},

	// maintains map centerpoint for responsive design
	calculateCenter: function () {
		center = map.getCenter();
	},

	//converts a slug or query string in to readable text
	convertToPlainString: function (text) {
		if (text == undefined) return '';
		return decodeURIComponent(text);
	},

	//-----custom functions-------
	// NOTE: if you add custom functions, make sure to append each one with a comma, except for the last one.
	// This also applies to the convertToPlainString function above

	//-----end of custom functions-------
}