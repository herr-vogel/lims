const {Link, browserHistory} = ReactRouter;

Admin = React.createClass({

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
        Meteor.call('canShow', 'Admin', function(error, result) {
            if(result !== undefined) {
                this.setState({
                    loadingCallback: false,
                    canShow: result
                })
            }
        }.bind(this))
    },

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