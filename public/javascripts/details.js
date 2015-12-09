/**
 * Created by Saikrishnam on 12/1/2015.
 */
/**
 * Created by Saikrishnam on 11/18/2015.
 */

var app = angular.module('details',[]);
app.controller('detailsCtrl',['$scope','$http',function($scope,$http){

console.log('hello in details module');

    getUserInfo();

    function getUserInfo(){
        $http.get('/getAllUsersInfo').success(function(res){

                  console.log(res.allUsersInfo);
                  $scope.allUsersInfo = res.allUsersInfo ;

        });
    }



}]);

