class IndexView extends View {
    name = "IndexView"

    constructor (ui){
        super();
        this.userInfo = ui;
    }

    init(){
        super.init();
        console.log('Initializing IndexView');
    }

    load() {
        console.log('Loading IndexView');
        console.log(this.userInfo.name)
    }
}

app.view(['UserInfo'], IndexView);