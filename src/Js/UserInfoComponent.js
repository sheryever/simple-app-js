class UserInfoComponent extends Component {
    name = "User info component"
    load () { console.log('loading user info components') }
}

app.component("UserInfo", UserInfoComponent);