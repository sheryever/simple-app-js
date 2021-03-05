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