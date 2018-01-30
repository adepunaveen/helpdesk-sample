define([],function(){
    var _files = [];
    function FileUpload(){
    }
    FileUpload.prototype={
        _init: function (fn){
            // position: absolute; opacity: 0; filter:Alpha(opacity=0);
            var ele = document.createElement('input');
            ele.multiple=false;
            //ele.accept="image/*";
            ele.type='file';
            //ele.style.display='none';
            ele.style.position = 'absolute';
            ele.style.left='-100px';
            ele.style.top='-100px';
            ele.style.opacity = 0;
            ele.style.filter = 'Alpha(opacity=0)';
            document.body.appendChild(ele);
            var THIS = this;
            ele.onchange = function (e){
                THIS._onchange(e,fn);
            };
            this._input = ele;
        },
        _onchange: function (e,fn){
          fn(e);
        },
        selectFiles: function (){
            this._input.click();
        }
    };
    return FileUpload;
});