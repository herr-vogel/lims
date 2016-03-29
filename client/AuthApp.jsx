const {browserHistory} = ReactRouter;

AuthApp = React.createClass({

    // Diese Componente wird dann angezeigt wenn der User auf /app springt. Er muss eingelogt sein sonst wird er auf /login weitergeleitet.

    mixins: [ReactMeteorData],

    getMeteorData() {

        return {
            currentUserId: Meteor.userId()
        };
    },

    // Checkt ob der user eingelogt ist.

    componentDidUpdate (prevProps, prevState) {
        if (!this.data.currentUserId) {
            browserHistory.push('/login');
        }
    },


    componentDidMount () {

        if (!this.data.currentUserId) {

            browserHistory.push('/login');
        }
    },

    render() {

        if (!this.data.currentUserId)
            return null;
        return (
            <div>
                <SideNav history={this.props.history}/>
                <main>
                    {this.props.children}
                </main>

            </div>
        );
    }
});