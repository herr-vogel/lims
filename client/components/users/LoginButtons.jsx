const {browserHistory} = ReactRouter;

LoginButtons = React.createClass({


    mixins: [ReactMeteorData],

    getMeteorData() {
        //console.log('LoginButtons: getMeteorData()...');
        //console.log('...currentUser: ', Meteor.user());
        //console.log('...currentUserId: ', Meteor.userId());
        return {
            currentUser: Meteor.user(),
            currentUserId: Meteor.userId()
        };

    },

    signOut(e) {
        e.preventDefault();

        Meteor.logout(this.signOutCallback);
    },

    signOutCallback(error) {
        if (error == undefined) {
            browserHistory.push('/');
        }
        else {
            //console.log('error: ' + error.reason);
        }
    },

    navigateToLogin() {
        browserHistory.push('/login');
    },

    render() {
        //console.log('LoginButtons: render()...');
        let loginButton;

        if (this.data.currentUser) {
            loginButton = (
                <a href="#" onClick={ this.signOut } className="waves-effect waves-teal">Logout | <b>{ this.data.currentUser.username }</b> </a>)
        } else {
            loginButton = (
                <a href="#" onClick={ this.navigateToLogin } className="waves-effect waves-teal">Login</a>
            )
        }
        return (
            loginButton
        )
    }
});
