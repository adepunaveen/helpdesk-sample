/*==========================================================
    Author      : Manish K
    Date Created: 2 Nov 2016
    Description : Directive for file Reader
    Change Log
    s.no      date    author     description


 ===========================================================*/

app.directive('fileReader', function () {
      return {
    restrict : "A",
    scope: true,
    link: function(scope, element, attr) {

      element.on('change', function(event) {
       var files = event.target.files;
       if(files.length>1){
        scope.$emit("fileSelected", { file: files });
       }
       else{
        scope.$emit("fileSelected", { file: files[0] });
       }

      });
    }
  };
  })
