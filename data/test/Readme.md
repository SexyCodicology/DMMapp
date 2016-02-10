# Google Fusion Tables to HTML tables

An app to display data from Google Fusion Tables in responsive, searchable HTML table or card format.

# Features

* Beautiful table design
* Multiple formats - card or table
* Searchable
* Responsive
* Pagination

## Demo

[http://pebbleroad.github.io/fusion-table-app/](http://pebbleroad.github.io/fusion-table-app/)

## How to use

1. Add table markup in your html

        <table class="datatable" cell-spacing="0" width="100%">
    

2. Initialize the app

        $(function(){

            app.init({
                el: $('.datatable'),
                dataSource: '1No1xirmHhmV99FdzCBC32AWAmwZaLuEZ2qAxhUA' // Your google fusion table ID
            })
        })
