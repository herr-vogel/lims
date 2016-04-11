Home = React.createClass({

    //this component is show when you first visit the site
    //input: user, userId
    //output: render Home

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            currentUser: Meteor.user(),
            currentUserId: Meteor.userId()
        };
    },

    componentWillMount() {
        document.title = 'Home';
    },

    render () {

        let home;

        if (!this.data.currentUserId) {
            home = (
                <div className="container">
                    <h1>Home</h1>
                    <p><LoginButtons /></p>
                </div>
            )
        }

        else {
            home = (
                <div className="container">
                    <h1>Home</h1>
                    <p>name: <b>{this.data.currentUser ? this.data.currentUser.profile.name : ""}</b></p>
                    <p>roles: <b>{(Roles.getRolesForUser(this.data.currentUser, DEFAULT_GROUP)).toString()}</b></p>
                </div>
            )
        }
        return home
    }
})