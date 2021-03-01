class CardsComponent extends Component {
    name = "Cards Component"
    load () { console.log('Loading the cards.json') }
}

app.component("Cards", CardsComponent);