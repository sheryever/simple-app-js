class View {
    validationAttributes = {}
    components = []

    initComponents () {

        for (var component in app.Components) {
            if (app.Components.hasOwnProperty(component)) {
                try {
                    var aComponent = app.dependencyService.getInstance(component);
                    aComponent['typeName'] = component;
                    this.components.push(aComponent);

                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    init () { this.initComponents(); }

    load () { }

    loadComponents () {
        for (var i = 0; i < this.components.length; i++) {
            try {
                this.components[i].load();
            } catch (error) {
                throw new Error("Error in " + this.components[i].typeName + ".load() function. \n" + error.stack);
            }
        }
    }

    // componentsKoBind () {

    //     for (var i = 0; i < this.components.length; i++) {
    //         try {
    //             this.components[i].koBind();
    //         } catch (error) {
    //             throw new Error("Error in " + this.components[i].typeName + ".koBind() function. \n" + error.stack);
    //         }
    //     }

    // }

    // koBind () { }

    initChildComponentsUi () {
        for (var i = 0; i < this.components.length; i++) {
            try {
                this.components[i].initUi();
            } catch (error) {
                throw new Error("Error in " + this.components[i].typeName + ".initViewUi() function. \n" + error.stack);
            }
        }
    }

    initViewUi() { }

    submitComponents () {
        var i = 0;
        for (i = 0; i < this.components.length; i++) {
            try {
                this.components[i].submit();
            } catch (error) {
                throw new Error("Error in " + this.components[i].typeName + ".submit() function. \n" + error.stack);
            }
        }
    }

    submit () { }
    
    resetComponents () {
        var i = 0;
        for (i = 0; i < this.components.length; i++) {
            try {
                this.components[i].reset();
            } catch (error) {
                throw new Error("Error in " + this.components[i].typeName + ".submit() function. \n" + error.stack);
            }
        }
    }

    reset () {
        this.resetComponents();
    } 
}
class Component {
    init () { }
    load () { }
    koBind () { }
    initUi () { }
    submit () { }
    reset () { }
}
class AppConfigBase {
    preStarting(app) { }
    preViewCreation(app) { }
    preAppUiInit(app) { }
    preUiInit(app) { }
    registerAppUi(app) { }
    preViewInit(app) { }
    preViewUiInit(app) { }
    preViewChildComponentsUiInit(app) { }
    preViewLoad(app) { }
    preViewChildComponentsLoad(app) { }
    appStarted(app) { }

}

class App {
    
    appConfig = null

    start (appConfig) {

        if (appConfig != null){
            this.appConfig = appConfig;
        }else{
            this.appConfig = new AppConfigBase();
        }

        this.appConfig.preStarting(this);

        // this.dependencyService.registerInstance("Util", Util, util);
        this.util = this.dependencyService.getInstance("Util");

        // this.dependencyService.registerInstance("Html", Html, html);
        this.html = this.dependencyService.getInstance("Html");

        // this.dependencyService.registerInstance("UI", UserInterface, ui);
        this.ui = this.dependencyService.getInstance("UI");


        this.appConfig.preViewCreation(this);

        if (this.viewDependencies) {
            let thisPage = this.dependencyService.getInstance("View");
            this.view = this.ViewClass ? thisPage : new View();
        }
        else {
            this.view = this.ViewClass ? new this.ViewClass() : new View();
        }

        this.appConfig.preAppUiInit(this);

        this.ui.init();

        this.appConfig.preViewInit(this);

        this.appConfig.registerAppUi(this);

        this.appConfig.preViewInit(this);
        this.view.init()

        this.appConfig.preViewUiInit(this);
        this.view.initViewUi();

        this.appConfig.preViewChildComponentsUiInit(this);
        this.view.initChildComponentsUi();

        
        this.appConfig.preViewLoad(this);
        this.view.load();

        this.appConfig.preViewChildComponentsLoad(this);
        this.view.loadComponents();

    }

    dependencyContainer = {};
    ///Dependency container
    dependencyService = {
        container: [],
        getGetDependencyInfo: function (typeName) {
            for (var i = 0; i < this.container.length; i++) {
                if (this.container[i].name === typeName) {
                    return this.container[i];
                }
            }

            throw new Error("\"" + typeName + " \" is not registered in dependencyService ");

        },
        registerType: function () {
            if (arguments.length === 2) {
                this.container.push({ name: arguments[0], Definition: arguments[1], instance: null });
            }
            if (arguments.length === 3) {
                this.container.push({
                    name: arguments[0],
                    dependencies: arguments[1],
                    Definition: arguments[2],
                    instance: null
                });
            }
        },
        registerInstance: function (name, definition, instance) {
            this.container.push({ name: name, Definition: definition, instance: instance });
        },
        getInstance: function (typeName, newInstance) {
            var dependencyInfo = this.getGetDependencyInfo(typeName);

            if (!newInstance && dependencyInfo.instance !== null) {
                return dependencyInfo.instance;
            }

            this.createNewInstance(dependencyInfo);

            return dependencyInfo.instance;
        },
        createNewInstance: function (dependencyInfo) {
            var dInfo = dependencyInfo;
            var requiredDependencies = [];
            if (dInfo.dependencies === undefined) {

                return dInfo.instance = new dInfo.Definition();

            }

            for (var i = 0; i < dInfo.dependencies.length; i++) {
                var dependencyName = dInfo.dependencies[i];

                var requiredDependencyInfo = this.getGetDependencyInfo(dependencyName);

                requiredDependencies.push(this.getInstance(requiredDependencyInfo.name));
            }

            return dInfo.instance = this.applyConstruct(dInfo.Definition, requiredDependencies);
        },
        applyConstruct: function (ctor, params) {
            var obj, newobj;

            // Create the object with the desired prototype
            if (typeof Object.create === "function") {
                // ECMAScript 5 
                obj = Object.create(ctor.prototype);
            } else if ({}.__proto__) {
                // Non-standard __proto__, supported by some browsers
                obj = {};
                obj.__proto__ = ctor.prototype;
                if (obj.__proto__ !== ctor.prototype) {
                    // Setting it didn't work
                    obj = makeObjectWithFakeCtor();
                }
            } else {
                // Fallback
                obj = makeObjectWithFakeCtor();
            }

            // Set the object's constructor
            //obj.constructor = ctor;

            // Apply the constructor function
            //newobj = ctor.apply(obj, params);
            newobj = Reflect.construct(ctor, params);

            // If a constructor function returns an object, that
            // becomes the return value of `new`, so we handle
            // that here.
            if (typeof newobj === "object") {
                obj = newobj;
            }

            // Done!
            return obj;

            // Subroutine for building objects with specific prototypes
            function makeObjectWithFakeCtor() {
                function fakeCtor() {
                }

                fakeCtor.prototype = ctor.prototype;
                return new fakeCtor();
            }
        }
    }
    
    url = null
    ViewClass = null
    PartialViews = {}
    Components = {}
    culture = null
    ui = {}
    util = {}
    html = {}
    
    //dateTime = dt = {};
    data = {}

    ajaxError(e, request, errorThrown, exception) {
        if (request.status === 308 || request.status === 401 ||  request.status === 302 || (request.status === 200 && request.state() === "rejected")) {//if (request.status === "308") {

            //window.location = request.getResponseHeader('RedirectLocation');
            window.location = window.location;

        }
    }

    redirectTo(url) {
        window.location.href = url;
    }

    showAlert() {

    }

    view () {

        if (arguments.length === 1) {
            this.dependencyService.registerType("View", arguments[0]);
            app.ViewClass = arguments[0];
        }
        if (arguments.length === 2) {
            this.dependencyService.registerType("View", arguments[0], arguments[1]);

            app.viewDependencies = arguments[0];
            app.ViewClass = arguments[1];
        }
    };

    component () {



        if (arguments.length === 2) {
            this.dependencyService.registerType(arguments[0], arguments[1]);
            app.Components[arguments[0]] = { Definition: arguments[1], dependencies: undefined };
        }
        else if (arguments.length === 3) {
            this.dependencyService.registerType(arguments[0], arguments[1], arguments[2]);

            app.Components[arguments[0]] = { Definition: arguments[2], dependencies: arguments[1] };
        } else {
            throw new Error("Invalid arguments, right syntax: app.component('UserInfo', UserInfoComponent); or app.component('UserInfo', ['UI'] /* constructor DI patameters */, UserInfoComponent);");
        }
    }

}

const app = new App();
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
class Html {

    constructor(ui) {
        this.ui = ui;
    }

    attachAntigeryToken(obj) {
        var token = $('[name="__RequestVerificationToken"]').val();

        if (!token) {
            throw new Error("__RequestVerificationToken element not found.");
        }

        obj.__RequestVerificationToken = token;

        return obj;
    }

    jtableCreatedByFullNameColumn() {
        return {
            title: this.ui.getResource('CreatedByFullName'),
            width: '10%',
            visibility: 'hidden',
            sorting: true,
            create: false,
            edit: false
        };
    };

    jtableModifiedByFullNameColumn() {
        return {
            title: this.ui.getResource('ModifiedByFullName'),
            width: '10%',
            visibility: 'hidden',
            sorting: true,
            create: false,
            edit: false
        };
    };

    jtableCreatedOnColumn() {
        return {
            title: this.ui.getResource('CreatedOnColumn'),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record.CreatedOn) {
                    var createdOn = new Date(data.record.CreatedOn);
                    return createdOn.getDate() + "-" + (createdOn.getMonth() + 1) + "-" + createdOn.getFullYear();
                }
                return "";
            }
        };
    };


    jtableDateColumn(options) {
        return {
            title: this.ui.getResource(options.title),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record[options.name]) {
                    var date = new Date(data.record[options.name]);
                    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                }
                return "";
            }
        };
    };

    jtableModifiedOnColumn() {
        return {
            title: this.ui.getResource('ModifiedOnColumn'),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record.ModifiedOn) {
                    var modifiedOn = new Date(data.record.ModifiedOn);
                    return modifiedOn.getDate() + "-" + (modifiedOn.getMonth() + 1) + "-" + modifiedOn.getFullYear();

                }

                return "";
            }
        };
    };

    jtableEditColumn(options) {
        return {
            title: this.ui.getResource(''),
            visibility: 'fixed',
            width: '0.2%',
            sorting: false,
            create: false,
            edit: false,
            listClass: 'jtable-command-column',
            display: function (data) {
                var html = '';
                if (typeof (options) === 'string') {
                    html = '<button title="Edit Record" onclick="document.location=\'' +
                        options + '/' + data.record.Id +
                        '\'" class="jtable-command-button jtable-edit-command-button"><span>Edit Record</span></button>';
                } else {
                    html = $(
                        '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button"><span>Edit Record</span></button>');
                    html.data('record', data.record);
                    html.on('click',
                        function () {
                            options.click($(this).data('record'));
                        });
                }

                return html;
            }
        };
    };
};

app.dependencyService.registerType('Html', ['UI'], Html);
class UserInterface {
    
    resources = []


    init() {
        if ($.datepicker) {
            $('.rlt-datepicker').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                language: "ar",
                rtl: true
            });
            $('.date-picker').datepicker({ language: 'ar', format: "dd/mm/yyyy", dateFormat: "dd/mm/yy" });
        }

        $('input[type="checkbox"],input[type="radio"] ').parent('label').addClass('pointer');

        $(document).on('keypress',
            'input.integer-only',
            function(e) {
                var keyCode = e.which ? e.which : e.keyCode;

                if (!(keyCode >= 48 && keyCode <= 57)) {
                    return false;
                } 
            });

        $(document).on('keypress',
            'input.float-only',
            function (e) {
                var keyCode = e.which ? e.which : e.keyCode;

                
                if ((keyCode >= 48 && keyCode <= 57)) {
                    // do nothing
                }
                else if (keyCode === 46) {
                    if (this.value.indexOf('.') > -1) return false;
                } else {
                    return false;
                }
            });
    };

    getResource(key) {

        return !this.resources[key] ? key : this.resources[key];
    };

    fixJtableDialogUi() {
        //$(".ui-dialog").bind("dialogopen", function () {
        $(document).on("dialogopen",
            ".ui-dialog",
            function () {
                // Reposition dialog, 'this' refers to the element the even occurred on.
                var $dialog = $(this);

                var $actionButton = $dialog.find("#EditDialogSaveButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-primary btn-sm')
                        .removeClass('ui-button')
                        .prev()
                        .addClass('btn btn-warning btn-sm cancel')
                        .removeClass('ui-button');
                }

                $actionButton = $dialog.find("#AddRecordDialogSaveButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-primary btn-sm')
                        .removeClass('ui-button')
                        .prev()
                        .addClass('btn btn-warning btn-sm cancel')
                        .removeClass('ui-button');
                }

                $actionButton = $dialog.find("#DeleteDialogButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-danger btn-sm')
                        .removeClass('ui-button')
                        .prev()
                        .addClass('btn btn-warning btn-sm cancel')
                        .removeClass('ui-button');

                }
                //$dialog.find('.ui-dialog-titlebar-close').text('x');
            });
    };
}

app.dependencyService.registerType('UI', UserInterface);
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


    //#endregion Mvc Actions

    //#endregion

};
class CustomAppConfig extends AppConfigBase {
    
    constructor(rootUrl, routeData){
        super();
        this.rootUrl = rootUrl;
        this.routeData = routeData;
    }

    preStarting(app) { 
        app.culture = 'ar-SA';

        //$(document).ajaxError(app.ajaxError);
        app.dependencyService.registerInstance("Url", MvcUrlHelper, new MvcUrlHelper(this.rootUrl, this.routeData));
        app.url = app.dependencyService.getInstance("Url");
    }

    preViewCreation(app) { 

        // $('#side-menu li.active').parent().prev().addClass('active');

        // $('.ultra-skin').hide();


    }

    preUiInit(app) {

        //app.ui.resources = __resources !== undefined ? __resources : [];

     }
    registerAppUi(app) { }
    preViewInit(app) { }
    preViewUiInit(app) { }
    preViewChildComponentsUiInit(app) { }
    preViewLoad(app) {

        app.ui.fixJtableDialogUi();


     }
    preViewChildComponentsLoad(app) { 

    }
    
    appStarted(app) {
        
        //applyKoBind(app);
    }

    applyKoBind(app){

        app.view.koBind();
        
        for (var i = 0; i < app.view.components.length; i++) {
            try {
                app.view.components[i].koBind();
            } catch (error) {
                throw new Error("Error in " + app.view.components[i].typeName + ".koBind() function. \n" + error.stack);
            }
        }

    }
}