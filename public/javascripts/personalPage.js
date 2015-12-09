/**
 * Created by Saikrishnam on 11/18/2015.
 */

  //function handler(){
  //  console.log('entered handler');
  //  return 'are you sure?';
  //}


var app = angular.module('userPasswordChange',['ngFileUpload']);
app.controller('userPasswordChangeCtrl',['$scope','$http','Upload', '$timeout','$q',function($scope,$http,Upload,$timeout,$q){

    $scope.$watch('imagePath', function() {
        console.log('hey, imagePath has changed!');
    });

    abc();

    function abc(){

        console.log('abc executes on back press');
        $http.get('/fn').success(function(res){
            console.log(res.message);


            $scope.imagePath = res.message ;

        });

    }



    $scope.changePassword = function(){
        //client side email verification if any

        //check if email exists in databse
        $http.post('/userPasswordChange',$scope.passwordChange).success(function(res){
            console.log(res);
            $scope.message = res.message ;
            console.log(res.message);
        });
    };

    $scope.logout = function(){

      $http.get('/logout').success(function(res){
            console.log('response message from logout is-------->'+res.message);
      });
    };


    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/users/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    console.log(response.data+'changing the imagePath variables');
                    $scope.imagePath = response.data;

                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }

    //$scope.getAll = function(){
    //    // make a request
    //
    //};



}]);

