const {browserHistory} = ReactRouter;

Admin = React.createClass({

    // this is the parent component for admin
    // input: -
    // output: render Admin

    getInitialState() {
        return {
            loadingCallback: true,
            canShow: undefined
        }
    },
    componentWillMount () {
        document.title = "LIMS Admin"
    },

    componentWillMount() {

        // this Meteor call checks if the user is allowed to see the Admin component
        // it gets back a boolean
        Meteor.call('canShow', 'Admin', function(error, result) {
            if(result !== undefined) {
                this.setState({
                    loadingCallback: false,
                    canShow: result
                })
            }
        }.bind(this))
    },

    // canShow function
    // is pushes to /app when you're not allowed to see Admin
    canShow: function() {
        if(!this.state.loadingCallback && !this.state.canShow) {
            browserHistory.push('/app');
        }
    },

    componentDidMount() {
        this.canShow();
    },

    componentDidUpdate (prevProps, prevState) {
        this.canShow();
    },

    render() {
        return (
            <div className="container">
                {this.props.children}
            </div>
        )
    }
})