var ngCIOC = angular.module('libreHR.directives' , []);

ngCIOC.service('userProfileService', function($rootScope, $window){
  var userProfiles = [];
  if (typeof userProfiles["mySelf"]=="undefined") {
    var result = mySelf();
    user = result.user;
    userProfiles["mySelf"]={ url:result.url.split("?")[0],  name: user.first_name+" "+user.last_name , DP : user.profile.displayPicture , email : user.email , username :user.username};
    // console.log(user);
  }

  $window.rootScopes = $window.rootScopes || [];
  $window.rootScopes.push($rootScope);

  if (!!$window.sharedService){
    return $window.sharedService;
  }

  $window.sharedService = {
    change: function(input){
      // do something with the input such as assigning it back to the variable
      angular.forEach($window.rootScopes, function(scope) {
        if(!scope.$$phase) {
            scope.$apply();
        }
      });
    },
    get: function(userUrl){
      if (typeof userProfiles[userUrl]=="undefined") {
        var user = getUser(userUrl);
        // console.log("going to GET");
        // console.log(user);
        userProfiles[userUrl]={url: userUrl, name: user.first_name+" "+user.last_name , DP : user.profile.displayPicture , email : user.email, username :user.username};
      }
      // console.log(userUrl);
      return userProfiles[userUrl];
    }
  }

  return $window.sharedService;
});

ngCIOC.filter('rainbow' , function(){
  return function(input){
    // console.log(input);
    input +=1;
    if (input%10 == 1){
      return "bg-aqua";
    } else if (input%10 == 2){
      return "bg-yellow";
    } else if (input%10 == 3) {
      return "bg-green";
    }else if (input%10 == 4) {
      return "bg-blue";
    }else if (input%10 == 5) {
      return "bg-orange";
    } else if (input%10 == 6){
      return "bg-purple";
    } else if (input%10 == 7) {
      return "bg-red";
    }else if (input%10 == 8) {
      return "bg-black";
    }else if (input%10 == 9) {
      return "bg-olive";
    } else{
      return "bg-fuchsia";
    }
  }
})

ngCIOC.directive('modal', function () {
  return {
    template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
              '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body">'+
              '<div ng-include="contentUrl"></div>'+
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:{
      data : '=',
      visible : '=',
      submitFn :'&',
    },
    controller : function($scope){
    },
    // attrs is the attrs passed from the main scope
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.title;
      scope.contentUrl = attrs.url;
      scope.$watch('visible', function(newValue , oldValue){
        if(newValue == true){
          $(element).modal('show');
        }
        else{
          $(element).modal('hide');
        }
      });

      $(element).on('shown.bs.modal', function(){
        scope.$apply(function(){
          scope.visible = true;
        });
      });

      $(element).on('hidden.bs.modal', function(){
        scope.$apply(function(){
          scope.data.statusMessage = '';
          scope.visible = false;
        });
      });
    }
  };
});

ngCIOC.filter('timeAgo' , function(){
  return function(input){
    t = new Date(input);
    var now = new Date();
    var diff = Math.floor((now - t)/60000)
    if (diff<60) {
      return diff+'M';
    }else if (diff>=60 && diff<60*24) {
      return Math.floor(diff/60)+'H';
    }else if (diff>=60*24) {
      return Math.floor(diff/(60*24))+'D';
    }
  }
})

ngCIOC.filter('humanize' , function(){
  return function(input){
    // insert a space before all caps
    input = input.replace('_' , ' ');
    input = input.replace(/([A-Z])/g, ' $1');
    // uppercase the first character
    input = input.replace(/^./, function(str){ return str.toUpperCase(); });
    return input;
  }
})

ngCIOC.filter('getIcon' , function(){
  return function(input){
    // console.log(scope.common);
    switch (input) {
      case 'LM':
        return 'fa-book';
      case 'PLM':
        return 'fa-square-o';
      case 'Social':
        return 'fa-facebook-square';
      case 'Payroll':
        return 'fa-money'
      default:
        return 'fa-bell-o';
    }
  }
})

ngCIOC.filter('getDP' , function(userProfileService){
  return function(userUrl){
    profile = userProfileService.get(userUrl);
    return profile.DP;
  }
})


ngCIOC.filter('getName' , function(userProfileService){
  return function(userUrl){
    profile = userProfileService.get(userUrl);
    return profile.name;
  }
})

ngCIOC.filter('explodeObj' , function(userProfileService){
  return function(input){
    if (typeof input =='object' && input!=null){
      toReturn = '';
      // console.log(input);
      for(key in input){
        val = input[key];
        if (val != null){
          // console.log('The key is ' + key + ' and the value is ' + val);
          urlTest = isUrl(val);
          if ( urlTest.type == 'hyperLink') {
            toReturn += '<a href=' + val + '> <i class="fa fa-link"></i> </a>';
          } else if (urlTest.type == 'image') {
            toReturn += ' <i class="fa fa-picture-o"></i> ';
          } else if(urlTest.type == 'string') {
            toReturn += val + ' , ';
          } else if(urlTest.type == 'number') {
            toReturn += val + ' , ';
          } else{
            toReturn += urlTest.type + ' , ';
          }
        } else{
          // console.log('The value is null for the key' + key);
          // toReturn += 'Null , ';
        }
      }
      return toReturn;
    }else if (isUrl(input).flag == true){
      return '<a href=' + input + '> <i class="fa fa-link"></i> </a>';
    }else{
      return input;
    }
  }
})

ngCIOC.filter('decorateCount' , function(){
  return function(input){
    if (input ==1){
      return "";
    }
    else {
      return "("+input+")";
    }
  }
})




ngCIOC.directive('messageStrip', function () {
  return {
    template: '<li class="container-fluid navBarInfoList" ng-click="openChat()">'+
      '<a class="row" style="position: relative; top:-7px; text-decoration:none !important;">'+
        '<img class="img-circle" ng-src="{{data.originator | getDP}}"  alt="My image" style="width:50px;height:50px;position: relative; top:-8px; "/>'+
        '<div class="col-md-10 pull-right" style="position: relative; top:-10px">'+
          '<span class="text-muted">{{data.originator | getName}}</span> {{data.count | decorateCount}}<small style="position:absolute;right:0px;" class="pull-right text-muted">{{data.created | timeAgo}} <i class="fa fa-clock-o "></i></small>'+
          '<br>{{data.message | limitTo:35}}'+
        '</div>'+
      '</a>'+
    '</li>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:{
      data : '=',
      openChat :'&',
    },
    controller : function($scope){
    },
    // attrs is the attrs passed from the main scope
    link: function postLink(scope, element, attrs) {
      scope.$watch('visible', function(newValue , oldValue){

      });
    }
  };
});

ngCIOC.directive('notificationStrip', function () {
  return {
    template: '<li class="container-fluid navBarInfoList" >'+
      '<a href="{{data.url}}" class="row" style="position: relative; top:-7px; text-decoration:none !important;">'+
        '<i class="fa {{data.originator | getIcon:this}} fa-2x"></i>'+
        '<div class="col-md-11 pull-right" style="position: relative; top:-10px">'+
          '<span class="text-muted">{{data.originator}}</span><small style="position:absolute;right:0px;" class="pull-right text-muted">{{data.created | timeAgo}} <i class="fa fa-clock-o "></i></small>'+
          '<br>{{data.shortInfo | limitTo:45 }}'+
        '</div>'+
      '</a>'+
    '</li>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:{
      data : '=',
    },
    controller : function($scope){
      // console.log($scope.data);
    },
    // attrs is the attrs passed from the main scope
    link: function postLink(scope, element, attrs) {
      scope.$watch('visible', function(newValue , oldValue){

      });
    }
  };
});

ngCIOC.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

ngCIOC.service('ngHttpSocket', ['$http', function ($http) {
  this.uploadFileToUrl = function(data, uploadUrl){

    $http.post(uploadUrl, data, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(function(){
    })
    .error(function(){

    });
  }
}]);


/*
This directive allows us to pass a function in on an enter key to do what we want.
 */

ngCIOC.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});


function getUser(url , mode){
  var httpRequest = new XMLHttpRequest()
  if(mode !="mySelf") {
    urlGet = url+"?format=json";
  }else{
    urlGet = url;
  }
  // console.log(url);
  httpRequest.open('GET', urlGet , false);
  httpRequest.send(null);
  if (httpRequest.status === 200) { // successfully
    user = JSON.parse(httpRequest.responseText);
    user.myUrl = url;
    return user
  }
}
function mySelf(){
  var httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', "http://localhost:8000/api/users/?mode=mySelf&format=json" , false);
  httpRequest.send(null);
  if (httpRequest.status === 200) { // successfully
    var temp = JSON.parse(httpRequest.responseText);
    // console.log(temp[0].url);
    return {user :getUser(temp[0].url , "mySelf") , url:temp[0].url};
  }
}
