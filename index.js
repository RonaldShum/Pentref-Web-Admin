console.log("hi");
var app = angular.module("sampleApp",["firebase"]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller("SampleCtrl",["$scope", "$firebaseArray", "$firebaseAuth","$firebaseObject",
    function($scope, $firebaseArray, $firebaseAuth,$firebaseObject){
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

        $scope.newTransport = {
            "nonTaiODestinationStation": null,
            "price": {
                "adultPrice": null,
                "childPrice": null
            },
            "typeEnum": null,
            "routeNumber": null
        };
        

        var firebaseObject = $firebaseObject(ref);
        firebaseObject.$loaded()
            .then(function(){
                console.log(firebaseObject);
                if(firebaseObject.Transport != null){
                    $scope.transportLocalArray = firebaseObject.Transport;
                }else{
                    $scope.transportLocalArray = [];
                }
                console.log($scope.transportLocalArray);
            });
        $scope.deleteTransport = function(tran){
            console.log("delete Transport pressed");
            if(confirm("Delete?")){
                $scope.transportLocalArray.splice($scope.transportLocalArray.indexOf(tran),1);
                console.log($scope.transportLocalArray);
                firebaseObject.Transport = $scope.transportLocalArray;
                firebaseObject.$save();
            }
        }
        $scope.deletePoi = function(poi){
            if(confirm("Delete?")){
                $scope.poisArray.$remove(poi);
                //need to remove photo too
            }
        };

        $scope.submitNewTransport = function(valid){
            //Data checking
            console.log(valid);
            if(valid){

                $scope.transportLocalArray.push($scope.newTransport);
                console.log($scope.transportLocalArray);
                //set all newTrasnport value to null
                $scope.newTransport = {
                    "nonTaiODestinationStation": null,
                    "price": {
                        "adultPrice": null,
                        "childPrice": null
                    },
                    "typeEnum": null,
                    "routeNumber": null
                };
                firebaseObject.Transport = $scope.transportLocalArray;
                firebaseObject.$save();
            }else{
                console.log("please enter correct value");
            }
        }

        //Message Test
        $scope.newMessage = {
            "poiId": null,
            "userId": null,
            "userName": null,
            "rating": null,
            "title": null,
            "description": null
        };
        
        $scope.sendMessage = function(){
            var messageArray = $firebaseArray(firebase.database().ref().child("POI messages").child($scope.messagePoiID));
            messageArray.$loaded()
                .then(function(){
                    console.log(messageArray);
                    messageArray.$add($scope.Message);
                })
                .catch(function(err){
                    console.log(err);
                });
        };

    }
]);