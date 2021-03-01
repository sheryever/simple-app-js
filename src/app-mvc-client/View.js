class View {
    validationAttributes = {};
    components = [];

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

    componentsKoBind () {

        for (var i = 0; i < this.components.length; i++) {
            try {
                this.components[i].koBind();
            } catch (error) {
                throw new Error("Error in " + this.components[i].typeName + ".koBind() function. \n" + error.stack);
            }
        }

    }

    koBind () { }

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