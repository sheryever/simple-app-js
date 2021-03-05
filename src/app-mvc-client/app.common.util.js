class Util {

    constructor(){
        
        Array.prototype.find = function(property, value) {
            return find(this, property, value);
        };

        Array.prototype.where = function (filter) {
            return where(this, filter);
        };
    
        Array.prototype.single = function (property, value) {
            return single(this, property, value);
        };
    
    }


    postToUrl (options) {
        var _options = {
            url: '',
            data: {},
            addFormOnly: false,
            target: '',
            deleteOnSubmit: true
        };

        $.extend(_options, options);

        var $frm = $("<form />").attr({
            action: _options.url,
            method: 'POST',
            style: 'display:none'
        });

        if (_options.target) {
            $frm.attr({ target: _options.target });
        }

        if (_options.deleteOnSubmit) {
            $frm.on('submit',
                function() {
                    setTimeout(function() { $frm.remove(); }, 1000);
                });
        }

        for (var prop in _options.data) {
            try {
                $('<input>').attr({
                    type: 'hidden',
                    name: prop,
                    value: _options.data[prop]
                }).appendTo($frm);

            } catch (e) {
                $('<input>').attr({
                    type: 'hidden',
                    name: prop,
                    value: ''
                }).appendTo($frm);

            } 
        }

        $('body').append($frm);
        if (!_options.addFormOnly) {
            $frm.submit();
        }

    };


    htmlParamsToObject(parameters) {
        return JSON.parse('{"' + decodeURI(parameters.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
    };

    
    find (objectArray, property, value) {
        var result = [];
        for (var i = 0; i < objectArray.length; i++) {
            var obj = objectArray[i];
            if (obj[property] === value)
                result.push(obj);
        }
        if (result.length === 0)
            return null;
        return result;
    };

    
    where (objectArray, filter) {
        var result = [];
        for (var i = 0; i < objectArray.length; i++) {
            var obj = objectArray[i];
            if (filter(obj))
                result.push(obj);
        }
        //if (result.length === 0)
        //    return null;
        return result;
    };


    single (objectArray, property, value) {
        for (var i = 0; i < objectArray.length; i++) {
            var obj = objectArray[i];
            if (obj[property] == value)
                return obj;
        }
        return null;
    };

    getCookie (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    setCookie (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : ("; expires=" + exdate.toUTCString()));
        document.cookie = c_name + "=" + c_value;
    }

    //function getCookie(c_name) {
    //    var i, x, y, ARRcookies = document.cookie.split(";");
    //    for (i = 0; i < ARRcookies.length; i++) {
    //        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    //        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    //        x = x.replace(/^\s+|\s+$/g, "");
    //        if (x == c_name) {
    //            return unescape(y);
    //        }
    //    }
    //}

    addOverloadMethod (object, name, fn) {
        var old = object[name];
        object[name] = function () {
            if (fn.length === arguments.length)
                return fn.apply(this, arguments);
            else if (typeof old === 'function')
                return old.apply(this, arguments);
        };
        return undefined;
    }

};

app.dependencyService.registerType('Util', Util);