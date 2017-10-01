var peer;
var container={peerId:null};
var host='https://192.168.0.5:9000';
var app=angular.module('vidChatApp',['ngRoute'])
.service('peer',function($http){
	this.getPeerId=function(scope){
		//{key:'wrsvligrcwcgcik9'}
		peer=new Peer();
		peer.on('open',function(id){
			scope.peerId=peer.id;
			container.peerId=peer.id;
			//$("#mId").html($("#mId").html()+scope.peerId);
			console.log($('mId'));
			console.log(scope.peerId);
		});		
	};
	this.getAvailable=function(scope){
		console.log('calling');
		$('#init_2').removeClass('hide');
		$('#warning').addClass('hide');
		$http.get(host+'/'+container.peerId+'/'+container.username+'/getAll')
		.then(function successCallback(resp){
			if(Array.isArray(resp.data)){
				scope.users=resp.data;
				$('#enter').removeAttr('disabled');
				//$('#refresh').attr('disabled','disabled');
			}else{
				scope.users=resp.data.arr;
				$('#warning').removeClass('hide');
			}
			console.log(resp.data)
		},function errorCallback(resp){
			console.log('damn it..');
		});
	};
})
.service('setup',function(){
	var constraint=window.constraint={
			video:true,
			audio:true
	};
	this.act=function(id){
		var userMedia=(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
		userMedia(
			constraint, 
			function(stream) {
				var anotherId=null;
  				if(id!=null){
  					console.log(id);
  					var call = peer.call(id, stream);
  					call.on('stream', function(remoteStream) {
  						$('#remote').prop('src', URL.createObjectURL(remoteStream));
						//var newStream = copyStream(stream);
						var um=(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
						um(
							constraint, 
							function(newStream) {
								newStream.getAudioTracks().map(s);
								$('#local').prop('src', URL.createObjectURL(newStream));
							},function(e){

							}
						);
  					});
  				}
			}, function(err) {
  				console.log('Failed to get local stream' ,err);
			});

		peer.on('call', function(call) {
		  //var newStream = stream.clone();
		  userMedia(constraint, function(stream) {
		    call.answer(stream); // Answer the call with an A/V stream.
		    call.on('stream', function(remoteStream) {
		      $('#remote').prop('src', URL.createObjectURL(remoteStream));
		      var um=(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
			  um(
					constraint, 
					function(newStream) {
						newStream.getAudioTracks().map(s);
						$('#local').prop('src', URL.createObjectURL(newStream));
					},function(e){

					}
				);
		    });
		  }, function(err) {
		    console.log('Failed to get local stream' ,err);
		  });
		});
		var s = function(t) {
    		t.enabled=false;
		};
		var copyStream=function(stream){
			try{
				try{
					var clonedStream = new webkitMediaStream(null, stream.getVideoTracks());
					//clonedStream.getAudioTracks().map(s);
					return clonedStream;
				}catch(e){
					console.log(e);
					var clonedStream=new webkitMediaStream(stream);
					clonedStream.getAudioTracks().map(s);
					return clonedStream;
				}
			}catch(e){
				console.log(e);
			}
		}
		
	};
	this.init=function(){
		var userMedia=(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
		userMedia(
			constraint, 
			function(stream) {
  				$('#videoElement').prop('src', URL.createObjectURL(stream));
			}, function(err) {
  				console.log('Failed to get local stream' ,err);
			}
		);
	}
})
.controller('entry',['$scope','peer','setup','$location',function($scope,peer,setup,$location){
	if(container.peerId==null)
		peer.getPeerId($scope);
	$scope.users=[];
	$scope.users.push({username:"Select One",remoteId:"dummy"});
	$scope.remoteId="dummy";
	$scope.enter=function(){
		container.peerId=$scope.remoteId;
		$location.url('/video')
	};
	$scope.tryenter=function(){
		container.username=$scope.username;
		
		peer.getAvailable($scope);
		//$scope.username;
	};
	$scope.refresh=function(){
		container.username=$scope.userName;
		peer.getAvailable($scope);
		//$scope.username;
	};
}])
.controller('vidChat',['$scope','peer','setup','$location',function($scope,peer,setup,$location){
	if(container.peerId==null){
		$location.url('/')
	}
	//$scope.connectClick=function(){
	console.log(container.peerId);
	setup.act(container.peerId);
	//}
}])
.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "entry.html",
        controller : "entry"
    })
    .when("/video", {
        templateUrl : "vidChat.html",
        controller : "vidChat"
    })
});