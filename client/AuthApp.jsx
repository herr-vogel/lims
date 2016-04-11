const {browserHistory} = ReactRouter;

AuthApp = React.createClass({

    // this component is shown when the user get pushed to /app
    // he has to be logged in to see this component
    // if not -> he gets pushed to /login
    //input: userId
    //output: render AuthApp

    mixins: [ReactMeteorData],

    getMeteorData() {

        return {
            currentUserId: Meteor.userId()
        };
    },

    // checks if the user is logged in

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
            return (
                <div className="container">
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                </div>
            )
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