/**
 * Created by Saikrishnam on 11/18/2015.
 */
var app = angular.module('passwordReset',[]);
app.controller('passwordResetCtrl',['$scope','$http',function($scope,$http){

    $scope.email = function(){
        //client side email verification if any

        //check if email exists in databse
        $http.post('/forgotPassword',$scope.forgotPassword).success(function(res){
            console.log(res);
            $scope.message = res.message ;
            //console.log(res.message);
        });
    };


}]);

