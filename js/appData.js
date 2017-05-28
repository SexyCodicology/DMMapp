$( document ).ready(function initData() {

    function placeAdder(placeAdd) {
        //Here goes the stuff for the Datatable
        var rowAdder = $("<tr>" + "<td>" + placeAdd.Nation + "</td>" + "<td>" + placeAdd.City + "</td>" + "<td>" + placeAdd.Library + "</td>" + "<td>" + placeAdd.lat + "</td>" + "<td>" + placeAdd.lng + "</td>" + "<td>" + placeAdd.Quantity + "</td>" + "<td>" + '<a href="' + placeAdd.Website + '" target="_blank">Browse the manuscripts</a>' + "</td>" + "</tr>");
        $("#datatableAdd").find('tbody').append(rowAdder);
    }

    $.get('js/dataAdded.json', function (tabledata) {
        if (tabledata instanceof Array) {
            tabledata = tabledata.concat(JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || []);
        } else {
            console.log("AJAX error");
            tabledata = JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || [];
        };
        //Datatable options go here! 
        $('#datatableAdd').DataTable({
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
    });
});