class DateTime {
    name = "I am datetime class object";
}

class App {
    
    init (rootUrl, routeData) {
        /// <summary>Initialize the application page</summary>
        /// <param name="rootUrl" type="String">Root url of the application</param>
        /// <param name="currentUser" type="Object" value="{userName:'user', userId: 1}">Current user information</param>
        /// <param name="routeData"  type="Object">Mvc route values to built proper URL on client side</param>

        //this.culture = getActiveLang();
        //app.ajaxError = ajaxError;
        //$(document).ajaxError(ajaxError);

        this.dependencyService.registerType("DateTime", DateTime);
        //this.dateTime = this.dt = this.dependencyService.getInstance("DateTime");

        // this.dependencyService.registerInstance("Util", Util, util);
        // this.util = this.dependencyService.getInstance("Util");

        // this.dependencyService.registerInstance("Url", MvcUrlHelper, new MvcUrlHelper(rootUrl, routeData));
        // this.url = this.dependencyService.getInstance("Url");

        // this.dependencyService.registerInstance("Html", Html, html);
        // this.html = this.dependencyService.getInstance("Html");

        // this.dependencyService.registerInstance("UI", UserInterface, ui);
        // this.ui = this.dependencyService.getInstance("UI");

        rootUrl = rootUrl; 

        // this.redirectTo = redirectTo;
        // this.showAlert = showAlert;

        // $('#side-menu li.active').parent().prev().addClass('active');

        // $('.ultra-skin').hide();

        if (this.viewDependencies) {
            let thisPage = this.dependencyService.getInstance("View");
            this.view = this.ViewClass ? thisPage : new View();
        }
        else {
            this.view = this.ViewClass ? new this.ViewClass() : new View();
        }


        // this.ui.init();
        //registerAppUi();
        this.view.init()

        this.view.initViewUi();
        this.view.initChildComponentsUi();


        // this.ui.fixJtableDialogUi();
        
        this.view.load();
        this.view.loadComponents();
        this.view.koBind();
        this.view.componentsKoBind();

    };

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
    
    url = null;
    ViewClass = null;
    PartialViews = {};
    Components = {};
    rootUrl = null;
    culture = null;
    ui = {};
    util = {};
    html = {};
    
    //dateTime = dt = {};
    data = {}

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

    // partialView () {



    //     if (arguments.length === 2) {
    //         this.dependencyService.registerType(arguments[0], arguments[1]);
    //         app.PartialViews[arguments[0]] = { Definition: arguments[1], dependencies: undefined };
    //     }
    //     else if (arguments.length === 3) {
    //         this.dependencyService.registerType(arguments[0], arguments[1], arguments[2]);

    //         app.PartialViews[arguments[0]] = { Definition: arguments[2], dependencies: arguments[1] };
    //     } else {
    //         throw new Error("Invalid arguments, right syntax: app.partialView('MyParticalView', MyParticalView); or app.partialView('MyParticalView', ['UI'] /* constructor DI patameters */, MyParticalView);");
    //     }
    // };

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

    configure(dependencyService){

    }
}

const app = new App();