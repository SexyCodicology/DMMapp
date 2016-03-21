(function(){

    'use strict';
    

    var app = {

        defaults: {
            url          : 'https://www.googleapis.com/fusiontables/v1/query?sql=',
            key          : 'AIzaSyBt51Kephzt5i8vo9vmZY1rCbzj-_mhNyY',
            mobileColumn : 'Name',
            klass        : 'min-tablet-l'
        },

        prepare: function(table){

            var query = "SELECT * FROM " + table + " LIMIT 1000";

            return encodeURI(this.options.url + query + '&key=' + this.options.key)

        },

        clean: function(data){

            var columns = [],
                category = [];
            
            /* Add responsive classes to table columns */

            for(var i = 0; i < data.columns.length; i++){
                
                var _klass = this.options.klass,
                    orderable= false

                /* Check if column should be display in mobile devices */

                switch(data.columns[i]){

                    case this.options.mobileColumn:
                        _klass = "all";
                        orderable = true;
                        break;
                }

                /* Push data to columns */
                        
                columns.push({
                    title: data.columns[i],
                    className: _klass,
                    orderable: orderable
                })    
            }

            
            return columns;            

        },

        init: function(options){

            var self = this

            this.instances = [];

            /* Extend options */

            this.options = $.extend({}, this.defaults, options)

            /* Initialize */

            options.el.each(function(){

                var $this = $(this),
                    id = self.options.dataSource || $this.data('fusion-table'),
                    url = self.prepare(id),
                    $t

                
                /* Append loading data */

                $this.append('<span class="loading">Downloading from google fusion table...</span>')    

                /* Request */

                var request = $.get(url);

                /* After request is completed */

                request.then(function(data){

                    /* Remove loader */

                    $this.find('.loading').remove()

                    /* Prepare columns */

                    var columns = self.clean(data);

                    /* Initialize datatable */

                    $t = $this.DataTable({
                            data           : data.rows,
                            columns        : columns,
                            responsive     : true,
                            iDisplayLength : 10,
                            lengthChange: false,                        
                            language: {
                                sSearchPlaceholder : "Search",
                                sSearch            : '',
                                paginate           : {
                                    
                                    previous : "‹ Previous",
                                    next     : "Next ›"

                                }                
                            },
                            initComplete: function(settings){

                            }
                    });

                    /* Add a resize handler */

                    var $w = $(window).off('resize.dt').on('resize.dt', function(){                
                
                        var _w = $w.width();

                        if(_w > 600){

                            $t.page.len(10).draw();
                        }else{
                            $t.page.len(-1).draw();
                        }

                    });


                    $this.data('datatable', $t);                    

                })

                // End request

            })
            

        }
    };


    /**
     * Return window object
     */
    
    return window._app = app;


    /**
     * On load
     */
    
    $(function(){

        
        
    })

    

})(undefined)