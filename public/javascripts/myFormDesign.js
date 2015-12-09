/**
 * Created by Saikrishnam on 11/18/2015.
 */
var app = angular.module('myForm',[]);
app.controller('myFormCtrl',['$scope','$http',function($scope,$http){

    $scope.changePassword = function(){
        //client side email verification if any

        //check if email exists in databse
        $http.post('/userPasswordChange',$scope.passwordChange).success(function(res){
            console.log(res);
            $scope.message = res.message ;
            console.log(res.message);
        });
    };




}]);


