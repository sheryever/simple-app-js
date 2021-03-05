/************************************************************************
 * SiteRoutes class
 * Author: Abu Ali Muhammad Sharjeel
 * Version 0.4
 *************************************************************************/

var MvcUrlHelper = function (rootUrl, mvcRouteData) {
    this.rootUrl = rootUrl;
    //this.apiRouteData = this.defaultApiRoute;
    this.defaultMvcRoute = mvcRouteData;
    if (!this.defaultMvcRoute.hasOwnProperty("mapWithDomain")) {
        extend(this.defaultMvcRoute, { mapWithDomain: false });
    }
    this.defaultApiRoute = { area: 'api', mapWithDomain: false };

    function extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }    

    //#region Routing Methods
    this._resolveUrl = function (routeUrl) {
        if (routeUrl.indexOf('~') > -1) {
            return routeUrl.replace('~/', rootUrl);
        }
        return routeUrl.replace('{0}', rootUrl);
    };


    this.resolveUrl = function (url) {
        //alert(url.indexOf('~') > -1);
        if (url.indexOf('~') > -1) {
            return url.replace('~/', rootUrl);
        }

        return rootUrl + url;
    };

    this.getLoginUrl = function(loginUrl) {
        var baseLoginUrl = this.mapWithDomain('account/login');
        if (loginUrl)
            baseLoginUrl = loginUrl;

        return '{0}?ReturnUrl={1}'.formatString(baseLoginUrl, location.pathname);
    }

    this.createUrl = function (url, routeData) {
        var parameters = routeData ? "?" + $.param(routeData) : "";
        return this.resolveUrl(url) + parameters;
    };

    this.getUrlParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    this.mapWithDomain = function (url) {
        var href = window.location.href;
        return href.substr(0, href.indexOf('/', 10)) + this.resolveUrl(url);
    }

    //#region api Actions

    this.api = function (action) {
        if (!this.defaultApiRoute.controller)
            throw "default controller is null.";
        return this.api(action, this.defaultApiRoute.controller, this.defaultApiRoute);
    };

    _addOverloadMethod(this, 'api', function (action, controller) {
        if (!this.defaultApiRoute)
            throw "default api route is null.";

        var url = this.api(action, controller, this.defaultApiRoute);

        return url;
    });

    _addOverloadMethod(this, 'api', function (action, controller, routeData) {
        if (!this.defaultApiRoute && !routeData)
            throw "default api route is null.";

        if (!controller && !this.defaultApiRoute.controller)
            throw "default controller is null.";

        if (!routeData.area)
            routeData.area = this.defaultApiRoute.area;

        if (!controller)
            controller = this.defaultApiRoute.controller;

        var url;

        var rootUrl = routeData.mapWithDomain ? this.mapWithDomain('') : this.rootUrl;

        if (routeData.area)
            url = "{0}{1}/{2}/{3}".formatString(rootUrl, routeData.area, controller, action);
        else
            url = "{0}{1}/{2}".formatString(rootUrl, controller, action);

        if (routeData.id)
            url = "{0}/{1}".formatString(url, routeData.id);

        if (routeData.params)
            url = "{0}?{1}".formatString(url, $.param(routeData.params));

        return url;
    });


    this.apiDropdownAction = function (action) {
        return this.api(action, "dropdownitems");
    };

    _addOverloadMethod(this, 'apiDropdownAction', function (action, params) {
        return this.api(action, "dropdownitems", { params: params });
    });

    this.apiForDropdown = function (key) {
        return this.api("get", "dropdownitems", { params: { 'for': key } });
    };

    this.apiForDropdowns = function (keys) {
        var itemsFor = keys.join(',');
        return this.api("get", "dropdownitems", { params: { 'for': itemsFor } });
    };

    this.apiJTableDropdownAction = function (key) {
        return "GET@" + this.apiForDropdown(key);
    };

    _addOverloadMethod(this, 'apiJTableDropdownAction', function (action, params) {
        return "GET@" + this.apiDropdownAction(action, params);
    });


    //#endregion api Actions

    //#region Mvc Actions

    this.actualAction = function (action) {
        return this.actualAction(action, this.defaultMvcRoute);
    };

    _addOverloadMethod(this, 'actualAction', function (action, routeData) {
        if (!this.defaultMvcRoute && !routeData)
            throw "defaultMvcRoute is null";

        if (!routeData.area && this.defaultMvcRoute != null)
            routeData.area = this.defaultMvcRoute.area;
        if (!routeData.controller)
            routeData.controller = this.defaultMvcRoute.controller;

        var url;

        if (routeData.area)
            url = "{0}/{1}/{2}".formatString(routeData.area, routeData.controller, action);
        else
            url = "{0}/{1}".formatString(routeData.controller, action);

        if (routeData.id)
            url = "{0}/{1}".formatString(url, routeData.id);

        if (routeData.params)
            url = "{0}?{1}".formatString(url, $.param(routeData.params));

        return url;
    });

    this.action = function (action) {
        return this.action(action, this.defaultMvcRoute);
    };

    _addOverloadMethod(this, 'action', function (action, routeData) {
        if (!this.defaultMvcRoute && !routeData)
            throw "defaultMvcRoute is null";

        if (routeData.area === undefined && this.defaultMvcRoute.area)
            routeData.area = this.defaultMvcRoute.area;
        if (!routeData.controller)
            routeData.controller = this.defaultMvcRoute.controller;

        var url;
        var rootUrl = routeData.mapWithDomain ? this.mapWithDomain('') : this.rootUrl;

        if (routeData.area)
            url = "{0}{1}/{2}/{3}".formatString(rootUrl, routeData.area, routeData.controller, action);
        else
            url = "{0}{1}/{2}".formatString(rootUrl, routeData.controller, action);

        if (routeData.id)
            url = "{0}/{1}".formatString(url, routeData.id);

        if (routeData.params)
            url = "{0}?{1}".formatString(url, $.param(routeData.params));

        return url;
    });


    /*
    this.mvcJtablePostAction = function (action) {
        
        return this.mvcJtablePostAction(action, this.defaultMvcRoute);
    };

    util.addOverloadMethod(this, 'mvcJtablePostAction', function (action, routeData) {
        return "POST@" + this.action(action, routeData);
    });
    */
    //#endregion Mvc Actions

    //#endregion

};