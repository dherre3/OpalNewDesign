var myApp = angular.module('MUHCApp');
myApp.controller('DocumentsController', ['Patient', 'Documents', 'UpdateUI', '$scope', '$timeout', 'UserPreferences', 'RequestToServer', '$cordovaFile','UserAuthorizationInfo','$q','$filter','NavigatorParameters',function(Patient, Documents, UpdateUI, $scope, $timeout, UserPreferences, RequestToServer,$cordovaFile,UserAuthorizationInfo,$q,$filter,NavigatorParameters){
  
  documentsInit();
  function documentsInit() {
    $scope.documents = Documents.getDocuments();
    $scope.documents = Documents.setDocumentsLanguage($scope.documents);
    if($scope.documents.length === 0) $scope.noDocuments=true;
      for (var i = 0; i < $scope.documents.length; i++) {
        if($scope.documents[i].DocumentType=='pdf')
        {
          $scope.documents[i].PreviewContent='./img/pdf-icon.png';
        }else{
          $scope.documents[i].PreviewContent=$scope.documents[i].Content;
        }
    }
  }
  $scope.goToDocument=function(doc)
  {
    if(doc.ReadStatus == '0')
    {
      doc.ReadStatus ='1';
      Documents.readDocument(doc.DocumentSerNum);
    }
    NavigatorParameters.setParameters({'navigatorName':'personalNavigator', 'Post':doc});
    personalNavigator.pushPage('./views/personal/my-chart/individual-document.html');
  };
  $scope.refreshDocuments = function($done) {
    RequestToServer.sendRequest('Refresh', 'Documents');
    var UserData = UpdateUI.update('Documents');
    UserData.then(function(){
      documentsInit();
      $done();
    });
    $timeout(function() {
      $done();
    }, 5000);
  };
}]);

myApp.controller('SingleDocumentController', ['NavigatorParameters','Documents', '$timeout', '$scope', '$cordovaEmailComposer','$cordovaFileOpener2','FileManagerService','Patient','NativeNotification','$filter',function(NavigatorParameters, Documents, $timeout, $scope,$cordovaEmailComposer,$cordovaFileOpener2, FileManagerService,Patient,NativeNotification,$filter) {
  
  console.log('Simgle Document Controller');
  var parameters = NavigatorParameters.getParameters();
  var image = Documents.setDocumentsLanguage(parameters.Post);
  if(image.DocumentType=='pdf')
  {
    image.PreviewContent='./img/pdf-icon.png';
  }else{
    image.PreviewContent=image.Content;
  }
console.log(image);
  $scope.documentObject=image;
  $scope.shareViaEmail=function()
  {
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app) {

          var attachment='';
          var email = {
            to: '',
            cc: '',
            bcc: [],
            subject: 'MUHC Document',
            body: '',
            isHtml: true
          };
          var base64=image.Content.indexOf('cdvfile');
          var data='';
          if(base64==-1)
          {
            console.log('Base64 file');
            attachment='base64:'+'attachment.'+image.DocumentType+'//'+image.Content.substring(image.Content.indexOf(',')+1,image.Content.length);
            email.attachments=[attachment];
            console.log(email);
            cordova.plugins.email.isAvailable(function(isAvailable){
                    console.log('is available');
              if(isAvailable)
              {
                cordova.plugins.email.open(email,function(sent){
                  console.log('email ' + (sent ? 'sent' : 'cancelled'));
                },this);
              }else{
                console.log('is not available');
              }
            });
          }else{
            console.log('cdvfile',image.Content );
            var attachmentFilePath = (ons.platform.isAndroid())?image.PathFileSystem:image.Content;
            window.resolveLocalFileSystemURL(attachmentFilePath,function(file){
              console.log(file);
              attachment=file.toURL();
              email.attachments=[attachment];
              console.log(email);
              cordova.plugins.email.isAvailable(function(isAvailable){
                if(isAvailable)
                {
                  cordova.plugins.email.open(email,function(sent){
                    console.log('email ' + (sent ? 'sent' : 'cancelled'));
                  },this);

                }else{
                  console.log('is not available');
                }
              });
            },function(error){
              console.log(error);
            });
          }
          //var attachment='base64:'+'attachment.'+image.DocumentType+'//'+image.Content.substring(image.Content.indexOf(',')+1,image.Content.length);
    } else {
      window.open(image.Content);
    }
  };


  $scope.printDocument=function()
  {
    var options = {
  			// type of content, use either 'Data' or 'File'
      title: 'Print Document', 	// title of document
      dialogX: -1,				// if a dialog coord is not set, it defaults to -1.
      dialogY: -1,
      success: function(arg){
        console.log(arg);
      },
      error: function(err){
        console.log(err);
      }
    };
    if(ons.platform.isAndroid())
    {
      if(image.DocumentType=='pdf')
      {
        options.type='File';
        options.data = image.CDVfilePath;
        console.log(options);
        window.plugins.PrintPDF.print(options);
      }else{
        FileManagerService.getFileUrl(image.PathFileSystem).then(function(file){
            var page = "<img src='"+file+"' style='width:100%;height:auto'>";
            page.replace(/"/g, '\'');
            console.log(page);
            cordova.plugins.printer.print(page, 'Document.html', function () {
                alert('printing finished or canceled');
            });
          }
        );
      }
    }else{
        options.type='File';
        options.data = image.CDVfilePath;
        console.log(options);
        window.plugins.PrintPDF.print(options);
    }
  };
  console.log(FileManagerService);
  $scope.openDocument = function() {
      var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
      if (app) {
        if(ons.platform.isAndroid()){
          //window.open('https://docs.google.com/viewer?url='+image.Content+'&embedded=true', '_blank', 'location=yes');
          if(image.DocumentType=='pdf')
          {
            console.log(image.PathFileSystem);
            $cordovaFileOpener2.open(
                image.PathFileSystem,
                'application/pdf'
              ).then(function() {
                  // file opened successfully
              }, function(err) {
                console.log(err);
                if(err.status == 9)
                {
                  NativeNotification.showNotificationAlert($filter('translate')("NOPDFPROBLEM"));
                }
                console.log('boom');
                  // An error occurred. Show a message to the user
            });
          }else{
            var ref = cordova.InAppBrowser.open(image.PathFileSystem, '_blank', 'EnableViewPortScale=yes');
          }

          //var ref = cordova.InAppBrowser.open(image.Content, '_system', 'location=yes');
        }else{
            var ref = cordova.InAppBrowser.open(image.Content, '_blank', 'EnableViewPortScale=yes');
        }
      } else {
        window.open(image.Content);
      }
    };
    /*var gesturableImg = new ImgTouchCanvas({
            canvas: document.getElementById('mycanvas2'),
            path: "./img/D-RC_ODC_16June2015_en_FNL.png"
        });*/
}]);


myApp.service('FileManagerService',function($q, $cordovaFileOpener2 ){
  var file='';
  function readDataUrl(file,response) {
    var r=$q.defer();
      var reader = new FileReader();
      var img='';
      reader.onloadend = function(evt) {
          console.log("Read as data URL");
          r.resolve(response(evt.target.result));
      };
    reader.readAsDataURL(file);
    return r.promise;
  }
  function callback(fileURL)
  {
    var r=$q.defer();
    file=fileURL;
    r.resolve(fileURL);
    return r.promise;
  }
  function gotFile(file){
      var r=$q.defer();
      r.resolve(readDataUrl(file,callback));
      return r.promise;
  }
return {
  downloadFileIntoStorage:function(url,targetPath)
  {
    var r=$q.defer();
    var fileTransfer = new FileTransfer();
    fileTransfer.download(url, targetPath,
      function(entry) {
        console.log(entry);
        r.resolve(entry);
      },
      function(err) {
        console.log(err);
        r.reject(err);
      });
  },
  getFileUrl:function(filePath)
  {
    var r=$q.defer();
    console.log(filePath);
    window.resolveLocalFileSystemURL(filePath, function(fileEntry){
      console.log('Inside getFileUrl');
      fileEntry.file(function(file){
        r.resolve(gotFile(file));
      },function(error)
      {
        r.reject(error);
        console.log(error);
      });
    }, function(error){
      console.log(error);
        r.reject(error.code);
    });
    return r.promise;
  },
    openPDF:function(url)
    {
      var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
      if (app) {
        if(ons.platform.isAndroid()){

            $cordovaFileOpener2.open(
                url,
                'application/pdf'
              ).then(function() {
                  // file opened successfully
              }, function(err) {
                console.log('boom');
                  // An error occurred. Show a message to the user
            });
          }else{
            var ref = cordova.InAppBrowser.open(url, '_blank', 'EnableViewPortScale=yes');
          }
      } else {
        window.open(url);
      }
    },
    openUrl:function(url)
    {
      var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
      if (app) {
        var ref = cordova.InAppBrowser.open(url, '_blank', 'EnableViewPortScale=yes');
      } else {
        window.open(url);
      }
    }
  };
});
