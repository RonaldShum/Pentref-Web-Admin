var app = angular.module("poiApp",["firebase"]);

app.controller("poiCtrl",["$scope", "$firebaseArray", "$firebaseAuth", "$firebaseObject", "$firebaseStorage",
    function($scope, $firebaseArray, $firebaseAuth, $firebaseObject, $firebaseStorage){
        
        var getQueryVariable = function(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                return pair[1];
                }
            } 
            alert('Query Variable ' + variable + ' not found');
        };
          
        $scope.picFile = "hi";
        
        $scope.authObj = $firebaseAuth();
        var poiId = getQueryVariable("q");
        console.log(poiId);
        $scope.user = $scope.authObj.$getAuth();

        var poiRef = firebase.database().ref().child("POI").child(poiId);
        $scope.poiObject = $firebaseObject(poiRef);
        $scope.poiObject.$loaded()
            .then(function(){
                console.log($scope.poiObject);
                
            })
            .catch(function(err){
                console.log(err);
            });
        
        $scope.submit = function(){
            console.log("submit pressed");
            $scope.poiObject.$save().then(function(ref){
                ref.key === $scope.poiObject;
                console.log("SUccess!");
            }, function(err){
                console.log(err);
            });
        };

        $scope.uploadPic = function(){
            console.log(document.getElementById('input').files[0]);
            var uploadPic = document.getElementById('input').files[0];
            var storageRef = firebase.storage().ref("images/"+$scope.poiObject.headerImageFileName);
            $scope.storage = $firebaseStorage(storageRef);

            $scope.storage.$delete().then(function(){
                console.log("successfully deleted!");
            }).catch(function(err){
                console.log(err);
            });
            
            var uploadTask = $scope.storage.$put(uploadPic,{contentType: uploadPic.type});
            uploadTask.$error(function(error){
                console.error(error);
            })
        };

        

        $scope.logout = function(){
            $scope.authObj.$signOut();
        };

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
        

        //upload image test
        
        

    }
]);