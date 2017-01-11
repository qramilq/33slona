var app = angular.module('slonApp', []);

app.controller('mainCtrl', function($scope, $http, $locale, $filter) {
    // number separator
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";

    // filter value
    $scope.myFilter = $filter('myFilter');

    // statuses
    $scope.statusList = [
        {
            value: 0,
            status:'Отклонен',
            class:'rejected'
        },
        {
            value: 1,
            status:'Опубликовано',
            class: 'public'
        },
        {
            value: 2,
            status:'Модерация',
            class: 'moderation'
        },
        {
            value: 3,
            status:'Внесен аванс',
            class: 'prepaid'
        },
        {
            value: 4,
            status:'Черновик',
            class: 'draft'
        }
    ]

    // set default status
    $scope.statusFilter = $scope.statusList[1];

    // get data from json
    $http.get("../testObject.json")
        .then(function(response) {
            var data = response.data.data;
            $scope.flats= data;
        });

});

// Custom filter
app.filter('myFilter', function() {
    return function(flats, statusFilter, searchFilter) {
        if (flats){

            // filtered array
            var filtered = [];

            // if status is 'Все'
            statusFilter = statusFilter || { value: '' }

            // checking flat's status function
            checkStatus = function(flat, status) {
                return (flat.status === status || status === '') || false;
            }

            checkSearch = function(flat, searchString) {

                // if search filter is empty
                if (!searchString) return true;
                
                // tmp variable to converting incoming variables to lower case strings
                var flatData = {
                    id: flat['id'].toString().toLowerCase(),
                    address: flat['address'].toString().toLowerCase(),
                }
                // format search string to string and to lower case to use indexOf()
                var formattedSearchString = searchString.toString().toLowerCase(); 

                // checking strings (need flat['lot'] check, but don't have)
                return ((flatData['id'].indexOf(formattedSearchString) !== -1) || 
                    (flatData['address'].indexOf(formattedSearchString) !== -1))
                    || false;

            }

            // checking each flat on filter's conditions
            for (var i = 0; i < flats.length; i++) {
                if (checkStatus(flats[i], statusFilter.value) && checkSearch(flats[i], searchFilter))
                    filtered.push(flats[i]);
            }

            return filtered;            
        }

    }
});