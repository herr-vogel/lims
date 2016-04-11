const {browserHistory} = ReactRouter;

LoginButtons = React.createClass({

    // this component is used to show the loginButtons in the sideNav
    // input: user, userId
    // output: render LoginButtons

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            currentUser: Meteor.user(),
            currentUserId: Meteor.userId()
        };

    },

    // signOut function

    signOut(e) {
        e.preventDefault();

        Meteor.logout(this.signOutCallback);
    },

    // signOutCallback function
    // it gets the error from Meteor.logout as a parameter

    signOutCallback(error) {
        if (error == undefined) {
            browserHistory.push('/');
        }
        else {
            //console.log('error: ' + error.reason);
        }
    },

    // navigateToLogin function
    // pushes the user to /login
    navigateToLogin() {
        browserHistory.push('/login');
    },

    render() {
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
