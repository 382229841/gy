app.factory('dataStringify', [function () {
    return function (requestData) {
        if (requestData) {
            var datas = requestData.split('&');
            datas.sort();
            return requestData + '&sign=' + $.md5(datas.join('&') + '&hikergou%@#');
        }
        return '';
    }
} ]); 