String.prototype.replaceAll = function (criteria, newString, ignore) {
    return this.replace(new RegExp(criteria.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&")
        , (ignore ? "gi" : "g")),
        (typeof (newString) === "string") ?
            newString.replace(/\$/g, "$$$$") : newString);
}

String.prototype.formatString = function () {
    if (arguments.length === 0) {
        return null;
    }

    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var placeHolder = '{' + (i) + '}';
        str = str.replaceAll(placeHolder, arguments[i] ? arguments[i] : '', true);
    }

    return str;
};

var _addOverloadMethod = function (object, name, fn) {
    var old = object[name];
    object[name] = function () {
        if (fn.length === arguments.length)
            return fn.apply(this, arguments);
        else if (typeof old === 'function')
            return old.apply(this, arguments);
    };
    return undefined;
};