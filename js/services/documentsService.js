var myApp=angular.module('MUHCApp');
myApp.service('Documents',['UserPreferences', '$cordovaDevice','$cordovaNetwork', 'UserAuthorizationInfo','$q','$rootScope', '$filter','FileManagerService','RequestToServer','LocalStorage',function(UserPreferences,$cordovaDevice,$cordovaNetwork,UserAuthorizationInfo,$q,$rootScope,$filter,FileManagerService,RequestToServer,LocalStorage){
	//Array photos contains all the documents for the patient
	var photos=[];
	var documentsNoFiles=[];
	var unreadDocuments=[];
	//Check document, if its an update delete it from photos
	function searchDocumentsAndDelete(documents)
	{
		var tmp=[];
		for (var i = 0; i < documents.length; i++) {
			for (var j = 0; j < photos.length; j++) {
				if(photos[j].DocumentSerNum==documents[i].DocumentSerNum)
				{
					console.log(photos[j]);
					photos.splice(j,1);
					break;
				}
			}
		}
	}
	function copyObject(object)
	{
		var newObject={};
		for (var key in object)
		{
			newObject[key]=object[key];
		}
		return newObject;
	}
	//Checks to see if a documents
	function isDocumentStored(serNum){
		var user=UserAuthorizationInfo.getUserName();
		var key=user+Documents;

	}
	function addDocumentsToService(documents)
	{
		var r=$q.defer();
		$rootScope.unreadDocuments=0;
		if(!documents) return;
			var promises=[];
			console.log(documents);
			console.log(documents.length);
			for (var i = 0; i < documents.length; i++) {
				//Get document type to build base64 string
				if(documents[i].DocumentType=='pdf')
				{
					documents[i].Content='data:application/pdf;base64,'+documents[i].Content;
				}else{
					documents[i].Content='data:image/'+documents[i].DocumentType+';base64,'+documents[i].Content;
				}
				//If app check to save in filesystem.
				var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
				if(app){
						var platform=$cordovaDevice.getPlatform();
						var targetPath='';
						if(platform==='Android'){
								targetPath = cordova.file.externalRootDirectory+'Documents/docMUHC'+documents[i].DocumentSerNum+"."+documents[i].DocumentType;
								documents[i].NameFileSystem='docMUHC'+documents[i].DocumentSerNum+"."+documents[i].DocumentType;
								console.log(documents[i].NameFileSystem);
								documents[i].CDVfilePath=" cdvfile://localhost/sdcard/Documents/"+documents[i].NameFileSystem;
						}else if(platform==='iOS'){
							targetPath = cordova.file.documentsDirectory+ 'Documents/docMUHC'+documents[i].DocumentSerNum+"."+documents[i].DocumentType;
							documents[i].NameFileSystem='docMUHC'+documents[i].DocumentSerNum+"."+documents[i].DocumentType;
							console.log(documents[i].NameFileSystem);
							documents[i].CDVfilePath="cdvfile://localhost/persistent/Documents/"+documents[i].NameFileSystem;
							//no sync, no icloud storage
							//targetPath = cordova.file.dataDirectory+ 'Documents/docMUHC'+documents[keysDocuments[i]].DocumentSerNum+"."+documents[keysDocuments[i]].DocumentType;
						}
						var url = documents[i].Content;
							var trustHosts = true
							var options = {};
							documentsNoFiles.push(documents[i]);
							documents[i].PathFileSystem=targetPath;
							promises.push(FileManagerService.downloadFileIntoStorage(url, targetPath));
				}else{
					//Add to localStorage array
					documentsNoFiles.push(documents[i]);
				}

				var imageToPhotoObject={};
				var url = documents[i].Content;
				imageToPhotoObject=copyObject(documents[i]);
				delete documents[i].Content;
				delete documents[i].PathLocation;
				imageToPhotoObject.Content=url;
				imageToPhotoObject.DateAdded=$filter('formatDate')(imageToPhotoObject.DateAdded);
				console.log('boom');
				photos.push(imageToPhotoObject);

				//Update Local Storage
			};
			console.log(photos);
			LocalStorage.WriteToLocalStorage('Documents',documentsNoFiles);
			$q.all(promises).then(function(results){
				console.log(documents);
				r.resolve(documents);
			});
			return r.promise;
	}
	return{
		setDocumentsOnline:function(documents){
			var r=$q.defer();
			photos=[];
			documentsNoFiles=[];
			console.log(documents);
			return addDocumentsToService(documents);
		},
		updateDocuments:function(documents)
		{
			var r=$q.defer();
			console.log(documents);
			searchDocumentsAndDelete(documents);
			return addDocumentsToService(documents);
		},
		setDocumentsOffline:function(documents)
		{
			console.log(documents);
			var r=$q.defer();
			photos=[];
			if(!documents) return;
			//var promises=[];
			for (var i = 0; i < documents.length; i++) {
				var imageToPhotoObject={};
				documents[i].DateAdded=$filter('formatDate')(documents[i].DateAdded);
				//promises.push(FileManagerService.getFileUrl(documents[i].PathFileSystem));
				documents[i].Content=documents[i].CDVfilePath;
				photos.push(documents[i]);
			}
			console.log(photos);
			console.log(documents);
			r.resolve(documents);

			/*$q.all(promises).then(function(results){
				console.log(results);
				for (var i = 0; i < results.length; i++) {
					documents[i].Content=results[i];
				}
				r.resolve(documents);
			},function(error){
				console.log(error);
				r.resolve(documents);
			});*/
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
