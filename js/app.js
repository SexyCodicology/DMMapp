var map, infowindow;
localStorage.placeData = localStorage.placeData ? localStorage.placeData : "";

function initMap() {
    var customMapType = new google.maps.StyledMapType([
        {
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
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
			}]
  }]);
    var customMapTypeId = 'custom_style';

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 48.76034594263708,
            lng: 8.609468946875056
        },
        zoom: 5,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);
    infowindow = new google.maps.InfoWindow();

    function placeMapper(place) {
        //Here goes the stuff for the Infowindow
        var infowindowContent = "<h3>" + place.Library + "</h3><p>" + place.Quantity + "</p>" + '<div class="linkbutton"><a class="btn btn-primary btn-block" href="' + place.Website + '" target="_blank">Browse the manuscripts</a></div>';
        //Here goes the stuff for the Datatable
        var row = $("<tr>" + "<td>" + place.Nation + "</td>" + "<td>" + place.City + "</td>" + "<td>" + place.Library + "</td>" + "<td>" + place.lat + "</td>" + "<td>" + place.lng + "</td>" + "<td>" + place.Quantity + "</td>" + "<td>" + '<a href="' + place.Website + '" target="_blank">Browse the manuscripts</a>' + "</td>" + "</tr>");
        var clickToggle = function () {
            map.setCenter({
                lat: place.lat,
                lng: place.lng
            });
            map.setZoom(12);
            infowindow.setContent(infowindowContent);
            infowindow.open(map, marker);
            row.parent().find('tr').removeClass('bolderText');
            row.addClass('bolderText');

            //Smootly scroll up to the map when a row is clicked
            $('html, body').animate({
                scrollTop: $("#dmmmap").offset().top
            }, 500);

        };
        $("#datatablex").find('tbody').append(row);

        var marker = new google.maps.Marker({
            position: {
                lat: place.lat,
                lng: place.lng
            },
            map: map,
            title: place.Library
        });
        row.click(clickToggle);
        marker.addListener('click', clickToggle);
    }

    $(document).ready(function () {
        $.get('js/data.json', function (tabledata) {
            if (tabledata instanceof Array) {
                tabledata = tabledata.concat(JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || []);
            } else {
                console.log("AJAX error");
                tabledata = JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || [];
            }
            tabledata.map(placeMapper);
            //Datatable options go here!
            var $tablex = $('#datatablex').DataTable({
                "responsive": true,
                "processing": true,
                "columnDefs": [
                    {
                        "targets": [3],
                        "visible": false,
                        "searchable": false
            },
                    {
                        "targets": [4],
                        "visible": false,
                        "searchable": false
            },
                    {
                        "targets": [6],
                        "visible": false,
                        "searchable": false
            },
                    {
                        responsivePriority: 1,
                        targets: 2
                    },
                    {
                        responsivePriority: 2,
                        targets: -1
                    }
        ]

            });

            // Replace diacritics in search as well to allow search input that has diacritics
            $('#datatablex_filter input[type=search]').keyup( function () {
              $tablex.search(
                  jQuery.fn.DataTable.ext.type.search.string( this.value )
                )
                .draw()
            } );
        });
        //Smootly scroll to the datatable when a row is clicked
        $('a[data-toggle="pill"], a[class="btn btn-primary btn-lg btn-block"] ').on('click', function () {
            $('html,body').animate({
                scrollTop: $('#dmmtable').offset().top
            }, 500);
        });
    })
};

var $tableAdded = $('#datatableAdded').DataTable({
    "ajax": "js/dataAdded.json",
    "responsive": true,
    "processing": true,
    "columns": [
        {
            "data": "Institution"
        },
        {
            "data": "Website"
        },
        ],
    "columnDefs": [{
        "targets": 1,
        "data": "Website",
        "render": function (data, type, full, meta) {
            return '<a href="' + data + '" target="_blank">Link</a>';
        }
  }]
});

$('#datatableAdded_filter input[type=search]').on("keyup", function () {
  $tableAdded.search(
      jQuery.fn.DataTable.ext.type.search.string( this.value )
    )
    .draw()
} );
