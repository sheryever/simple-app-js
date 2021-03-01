class IndexView extends View {
    name = "IndexView";

    constructor (dt){
        super();
        this.dt = dt;
    }

    init(){
        super.init();
        console.log('Initializing IndexView');
    }

    load() {
        console.log('Loading IndexView');
        console.log(this.dt.name);
    }
}

app.view(['DateTime'], IndexView);