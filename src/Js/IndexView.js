class IndexView extends View {
    name = "IndexView";

    constructor (dt, ui){
        super();
        this.dt = dt;
        this.userInfo = ui;
    }

    init(){
        super.init();
        console.log('Initializing IndexView');
    }

    load() {
        console.log('Loading IndexView');
        console.log(this.dt.name);
        console.log(this.userInfo.name)
    }
}

app.view(['DateTime', 'UserInfo'], IndexView);