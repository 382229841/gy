app.factory('dataStringify', [function () {
    return function (api,requestData,isSet) {
        var raw = function (args) {
              args.t=(new Date()).getTime();
              args.device='5';

              var keys = Object.keys(args);
              keys = keys.sort()
              var newArgs = {};
              keys.forEach(function (key) {
                //newArgs[key.toLowerCase()] = args[key];
                newArgs[key] = args[key];
              });

              var string = '';
              for (var k in newArgs) {
                  string += '&' + k + '=' + newArgs[k];
              }
              string = string.substr(1);
              return string;
        };
        var sign=raw(requestData);
        if (requestData) {
            if(isSet){
                return api+'?m5=' + $.md5('/api'+api+'?'+sign+'_2014hofysoft_web');
            }else{
                return api+'?'+ sign + '&m5=' + $.md5('/api'+api+'?'+sign+'_2014hofysoft_web');
            }
            
        }
        return '';
    }
} ]); 