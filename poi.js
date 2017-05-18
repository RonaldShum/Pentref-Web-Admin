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
        $scope.photoSelected = false;

        $scope.picFile = "hi";

        $scope.setFile = function(element) {
            $scope.photoSelected = true;
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function(event) {
                $scope.image_source = event.target.result
                $scope.$apply()

            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        };
        
        $scope.authObj = $firebaseAuth();
        var poiId = getQueryVariable("q");
        console.log(poiId);
        $scope.user = $scope.authObj.$getAuth();

        var poiRef = firebase.database().ref().child("POI").child(poiId);
        $scope.poiObject = $firebaseObject(poiRef);
        $scope.poiObject.$loaded()
            .then(function(){
                console.log($scope.poiObject);
                //current photo on firebase
                getCurrentPhoto();
            })
            .catch(function(err){
                console.log(err);
            });
        
        var getCurrentPhoto = function(){
            var storageRef = firebase.storage().ref('images/'+$scope.poiObject.headerImageFileName)
                    .getDownloadURL().then(function(url) {
                        // `url` is the download URL for 'images/stars.jpg'

                        // This can be downloaded directly:
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = function(event) {
                            var blob = xhr.response;
                            console.log("hihi");
                        };
                        xhr.open('GET', url);
                        xhr.send();

                        // Or inserted into an <img> element:
                        var img = document.getElementById('currentPhoto');
                        img.src = url;
                        }).catch(function(error) {
                        // Handle any errors
                        console.log("hi");
                        console.log(error)
                });
        };
        
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
            });
            uploadTask.onSuccess

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

        $scope.messages = $firebaseArray(firebase.database().ref().child("POI messages").child(poiId));

        
        
        

    }
]);