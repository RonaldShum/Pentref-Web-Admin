var app = angular.module("transportApp",["firebase"]);

app.controller("transportCtrl",["$scope", "$firebaseArray", "$firebaseAuth", "$firebaseObject", "$firebaseStorage",
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

        
        
        $scope.authObj = $firebaseAuth();
        var transportId = getQueryVariable("q");
        $scope.user = $scope.authObj.$getAuth();

        var transportRef = firebase.database().ref().child("Transport").child(transportId);
        $scope.transportObject = $firebaseObject(transportRef);
        $scope.transportObject.$loaded()
            .then(function(){
                //console.log($scope.transportObject);
                //initizate local arrays of the time table
                //fTOMTS = from tai o mon to sat etc.
                //console.log($scope.transportObject.fromTaiO);
                try{
                    if($scope.transportObject.fromTaiO.monToSat != null){
                        $scope.fTOMTSLocalArray = $scope.transportObject.fromTaiO.monToSat;
                        $scope.fTOMTSLocalArray.sort();
                    }else{
                        $scope.fTOMTSLocalArray =[];
                    }
                }catch(err){
                    $scope.fTOMTSLocalArray = [];
                }

                try{
                    if($scope.transportObject.fromTaiO.sunAndPublicHoliday != null){
                        $scope.fTOSAPHLocalArray = $scope.transportObject.fromTaiO.sunAndPublicHoliday;
                        $scope.fTOSAPHLocalArray.sort();
                    }else{
                        $scope.fTOSAPHLocalArray = [];
                    }
                }catch(err){
                    $scope.fTOSAPHLocalArray = [];
                }

                try{
                    if($scope.transportObject.toTaiO.sunAndPublicHoliday != null){
                        $scope.tTOMTSLocalArray = $scope.transportObject.toTaiO.monToSat;
                        $scope.tTOMTSLocalArray.sort();
                    }else{
                        $scope.tTOMTSLocalArray = [];
                    }
                }catch(err){
                    $scope.tTOMTSLocalArray = [];
                }

                try{
                    if($scope.transportObject.toTaiO.sunAndPublicHoliday != null){
                        $scope.tTOSAPHLocalArray = $scope.transportObject.toTaiO.sunAndPublicHoliday;
                        $scope.tTOSAPHLocalArray.sort();
                    }else{
                        $scope.tTOSAPHLocalArray = [];
                    }
                }catch(err){
                    $scope.tTOSAPHLocalArray = [];
                }
                //console.log($scope.fTOSAPHLocalArray);
                
            })
            .catch(function(err){
                console.log(err);
            });

        $scope.isTimeVaild = function(time){
            if(time.slice(0,2) >= "00" && time.slice(0,2) < "24" 
            && time.slice(3,5) < "60" && time.slice(3,5)>="00"
            && time.length === 5
            && time.slice(2,3) === ":"){
                return true;
            }else{
                return false;
            }
        };

        /** 
         * @param localArray 
         * @param fBO
         * @param time
         * @param isMonToSat
         */
        $scope.addTime = function(localArray,fBO,time,isMonToSat){
            if($scope.isTimeVaild(time)){
                localArray.push(time);
                localArray.sort();
                if(isMonToSat){
                    fBO.monToSat = localArray;
                    fBO.$save();
                }else{
                    fBO.sunAndPublicHoliday = localArray;
                    fBO.$save();
                }
            }else{
                 alert("Time Invaild");
            }
        }

        
        //From Tai O Mon To Sat
        var fromtaioRef = firebase.database().ref().child("Transport").child(transportId).child("fromTaiO");
        $scope.fromtaioObject = $firebaseObject(fromtaioRef);
        $scope.fromtaioObject.$loaded()
            .then(function(){
                console.log($scope.fromtaioObject);
            });
        
        $scope.addTimeFTOMTS = function(){
            $scope.addTime($scope.fTOMTSLocalArray,$scope.fromtaioObject,$scope.fTOMTSTime,true);
            $scope.fTOMTSTime = "";
            // if($scope.isTimeVaild($scope.fTOMTSTime)){
            //     $scope.fTOMTSLocalArray.push($scope.fTOMTSTime);
            //     $scope.fTOMTSTime = "";
            //     $scope.fTOMTSLocalArray.sort();
            //     $scope.fromtaioObject.monToSat = $scope.fTOMTSLocalArray;
            //     $scope.fromtaioObject.$save();
            // }
        }

        $scope.deleteTimeFTOMTS = function(time){
            $scope.fTOMTSLocalArray.splice($scope.fTOMTSLocalArray.indexOf(time),1);
            $scope.fTOMTSLocalArray.sort();
            $scope.fromtaioObject.monToSat = $scope.fTOMTSLocalArray;
            $scope.fromtaioObject.$save();
        }
        
        $scope.refreshFTOMTS = function(){
            //TODO: do data checking
            //console.log($scope.testLocalArray);
            console.log($scope.fTOMTSLocalArray);
            $scope.fromtaioObject.monToSat = $scope.fTOMTSLocalArray;
            $scope.fromtaioObject.$save();
        };



        //End region

        //From Tai O Sun And public Holiday
        $scope.addTimeFTOSAPH = function(){
            $scope.addTime($scope.fTOSAPHLocalArray,$scope.fromtaioObject,$scope.fTOSAPHTime,false);
            $scope.fTOSAPHTime = "";
            // if($scope.isTimeVaild($scope.fTOSAPHTime)){
            //     $scope.fTOSAPHLocalArray.push($scope.fTOSAPHTime);
            //     $scope.fTOSAPHTime = "";
            //     $scope.fTOSAPHLocalArray.sort();
            //     $scope.fromtaioObject.sunAndPublicHoliday = $scope.fTOSAPHLocalArray;
            //     $scope.fromtaioObject.$save();
            // }
        }        

        $scope.deleteTimeFTOSAPH = function(time){
            $scope.fTOSAPHLocalArray.splice($scope.fTOSAPHLocalArray.indexOf(time),1);
            $scope.fTOSAPHLocalArray.sort();
            $scope.fromtaioObject.sunAndPublicHoliday = $scope.fTOSAPHLocalArray;
            $scope.fromtaioObject.$save();
        };

        $scope.refreshFTOSAPH = function(){
            $scope.fromtaioObject.sunAndPublicHoliday = $scope.fTOSAPHLocalArray;
            $scope.fromtaioObject.$save();
        };

        //To Tai O Mon To Sat
        var toTaiORef = firebase.database().ref().child("Transport").child(transportId).child("toTaiO");
        $scope.toTaiOObject = $firebaseObject(toTaiORef);
        $scope.toTaiOObject.$loaded()
            .then(function(){
                console.log("totaioobject");
                console.log($scope.toTaiOObject);
            });
        
        $scope.addTimeTTOMTS = function(){
            $scope.addTime($scope.tTOMTSLocalArray,$scope.toTaiOObject,$scope.tTOMTSTime,true);
            $scope.tTOMTSTime = "";
            // console.log($scope.tTOMTSTime);
            // $scope.tTOMTSLocalArray.push($scope.tTOMTSTime);
            // $scope.tTOMTSTime = "";
            // $scope.tTOMTSLocalArray.sort();
            // console.log($scope.tTOMTSLocalArray);
            // $scope.toTaiOObject.monToSat = $scope.tTOMTSLocalArray;
            // $scope.toTaiOObject.$save();
        };

        $scope.deleteTimeTTOMTS = function(time){
            $scope.tTOMTSLocalArray.splice($scope.tTOMTSLocalArray.indexOf(time),1);
            $scope.tTOMTSLocalArray.sort();
            $scope.toTaiOObject.monToSat = $scope.tTOMTSLocalArray;
            $scope.toTaiOObject.$save();
        };

        $scope.refreshTTOMTS = function(){
            $scope.toTaiOObject.monToSat = $scope.tTOMTSLocalArray;
            $scope.toTaiOObject.$save();
        };
        //To Tai O Sunday And Public Holiday
        $scope.addTimeTTOSAPH = function(){
            $scope.addTime($scope.tTOSAPHLocalArray,$scope.toTaiOObject,$scope.tTOSAPHTime,false);
            $scope.tTOSAPHTime = "";
            // console.log($scope.tTOSAPHTime);
            // $scope.tTOSAPHLocalArray.push($scope.tTOSAPHTime);
            // $scope.tTOSAPHTime = "";
            // $scope.tTOSAPHLocalArray.sort();
            // console.log($scope.tTOSAPHLocalArray);
            // $scope.toTaiOObject.sunAndPublicHoliday = $scope.tTOSAPHLocalArray;
            // $scope.toTaiOObject.$save();
        }

        $scope.deleteTimeTTOSAPH = function(time){
            $scope.tTOSAPHLocalArray.splice($scope.tTOSAPHLocalArray.indexOf(time),1);
            $scope.tTOSAPHLocalArray.sort();
            $scope.toTaiOObject.sunAndPublicHoliday = $scope.tTOSAPHLocalArray;
            $scope.toTaiOObject.$save();
        }

        $scope.refreshTTOSAPH = function(){
            $scope.toTaiOObject.sunAndPublicHoliday = $scope.tTOSAPHLocalArray;
            $scope.toTaiOObject.$save();
        }

        
        
  
        
        

        

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
function tempFunction(num){
    alert(num);
};