app.factory('signSha1', [function () {
    return function (requestData) {
        if (requestData) {
            return $.sha1(requestData);
        }
        return '';
    }
} ]); 