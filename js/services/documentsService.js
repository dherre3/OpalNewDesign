var myApp=angular.module('MUHCApp');
myApp.service('Documents',['UserPreferences', '$cordovaDevice','$cordovaNetwork', 'UserAuthorizationInfo','$q','$rootScope', '$filter','FileManagerService','RequestToServer',function(UserPreferences,$cordovaDevice,$cordovaNetwork,UserAuthorizationInfo,$q,$rootScope,$filter,FileManagerService,RequestToServer){
	var photos=[];
	function isDocumentStored(serNum){
		var user=UserAuthorizationInfo.getUserName();
		var key=user+Documents;

	}
	var unreadDocuments=[];
	return{
		setDocumentsOnline:function(documents){
			var r=$q.defer();
			photos=[];
			console.log(documents);
			$rootScope.unreadDocuments=0;
			if(!documents) return;
				var keysDocuments=Object.keys(documents);
				var promises=[];
				for (var i = 0; i < keysDocuments.length; i++) {
					if(documents[keysDocuments[i]].DocumentType=='pdf')
					{
						documents[keysDocuments[i]].Content='data:application/pdf;base64,'+documents[keysDocuments[i]].Content;
					}else{
						documents[keysDocuments[i]].Content='data:image/'+documents[keysDocuments[i]].DocumentType+';base64,'+documents[keysDocuments[i]].Content;
					}
					var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	        if(app){
							var platform=$cordovaDevice.getPlatform();
							var targetPath='';
							if(platform==='Android'){
						    	targetPath = cordova.file.externalRootDirectory+'Documents/docMUHC'+documents[keysDocuments[i]].DocumentSerNum+"."+documents[keysDocuments[i]].DocumentType;
							}else if(platform==='iOS'){
								targetPath = cordova.file.dataDirectory+ 'Documents/docMUHC'+documents[keysDocuments[i]].DocumentSerNum+"."+documents[keysDocuments[i]].DocumentType;
							}
							var url = documents[keysDocuments[i]].Content;
						    var trustHosts = true
						    var options = {};
						    documents[keysDocuments[i]].NameFileSystem='docMUHC'+documents[keysDocuments[i]].DocumentSerNum+"."+documents[keysDocuments[i]].DocumentType;
						    documents[keysDocuments[i]].PathFileSystem=targetPath;
								promises.push(FileManagerService.downloadFileIntoStorage(url, targetPath));
					}

					var imageToPhotoObject={};
					imageToPhotoObject=angular.copy(documents[i]);
					delete documents[keysDocuments[i]].Content;
          delete documents[keysDocuments[i]].PathLocation;
					photos.push(imageToPhotoObject);
				};
				console.log(imageToPhotoObject);
				$q.all(promises).then(function(results){
					console.log(documents);
					r.resolve(documents);
				});
				return r.promise;


		},
		setDocumentsOffline:function(documents)
		{
			var r=$q.defer();
			photos=[];
			if(!documents) return;
			var keysDocuments=Object.keys(documents);
			var promises=[];
			for (var i = 0; i < keysDocuments.length; i++) {
				var imageToPhotoObject={};
				documents[keysDocuments[i]].DateAdded=$filter('formatDate')(documents[keysDocuments[i]].DateAdded);
				promises.push(FileManagerService.getFileUrl(documents[keysDocuments[i]].PathFileSystem));
				photos.push(documents[keysDocuments[i]]);
			}
			console.log(documents);
			$q.all(promises).then(function(results){
				console.log(results);
				for (var i = 0; i < results.length; i++) {
					documents[i].Content=results[i];
				}
				r.resolve(documents);
			},function(error){
				console.log(error);
				r.resolve(documents);
			});
			 return r.promise;
		},
		getDocuments:function(){
			return photos;
		},
		getUnreadDocuments:function()
		{
			var array=[];
			for (var i = 0; i < photos.length; i++) {
				console.log(photos[i]);
				if(photos[i].ReadStatus=='0'){
					array.push(photos[i]);
				}
			}
			console.log(array);
			array=$filter('orderBy')(array,'DateAdded');
			return array;
		},
		readDocument:function(serNum)
		{
			for (var i = 0; i < photos.length; i++) {
				if(photos[i].DocumentSerNum==serNum){
					photos[i].ReadStatus='1';
					RequestToServer.sendRequest('ReadDocument',{DocumentSerNum:serNum});
				}
			}
		},
		getDocumentBySerNum:function(serNum)
		{
			for (var i = 0; i < photos.length; i++) {
				if(photos[i].DocumentSerNum==serNum){
					return photos[i];
				}
			};
		}

	};


}]);
