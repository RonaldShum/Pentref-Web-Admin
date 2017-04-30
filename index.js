console.log("hi");
var app = angular.module("sampleApp",["firebase"]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller("SampleCtrl",["$scope", "$firebaseArray", "$firebaseAuth",
    function($scope, $firebaseArray, $firebaseAuth){
        var ref = firebase.database().ref();
        $scope.authObj = $firebaseAuth();
        $scope.user = $scope.authObj.$getAuth();
        
        $scope.login = function(){
             $scope.authObj.$signInWithEmailAndPassword($scope.inputEmail, $scope.inputPassword)
             .then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
             }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
        }

        $scope.logout = function(){
            $scope.authObj.$signOut();
        }

        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                $scope.user = $scope.authObj.$getAuth();
                console.log("Signed in as:", firebaseUser.uid);
            } else {
                $scope.user = $scope.authObj.$getAuth();
                console.log("Signed out");
            }
            });

       
        //download the data into a local object
        // firebase.auth().signInWithEmailAndPassword("sss@fff", 1234)
        // .then(function(authData) {
        //     console.log("Logged in as:", authData.uid);
        // }).catch(function(error) {
        //     console.error("Authentication failed:", error);
        // });
        
        var poiRef = firebase.database().ref().child("POI");
        $scope.poisArray = $firebaseArray(poiRef);
        console.log("222");
        $scope.poisArray.$loaded()
            .then(function(){
                console.log($scope.poisArray);
            })
            .catch(function(err){
                console.log(err);
            });
        
        var transRef = firebase.database().ref().child("Transport");
        $scope.transArray = $firebaseArray(transRef);
        $scope.transArray.$loaded()
            .then(function(){
                console.log($scope.transArray);
            })
            .catch(function(err){
                console.log(err);
            });


    }
]);