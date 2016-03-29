Home = React.createClass({

    //Diese Componente ist die erste Seite, die der User zu gesicht bekommt.

    mixins: [ReactMeteorData],

    getMeteorData() {
        //console.log('Home: getMeteorData()...');
        //console.log('...user: ', Meteor.user());
        //console.log('...userId: ', Meteor.userId());
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