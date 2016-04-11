const {Link,browserHistory} = ReactRouter;


Customer = React.createClass({

    // this is the parent component for customer
    // input: -
    // output: render Customer

    getInitialState() {
        return {
            loadingCallback: true,
            canShow: undefined
        }
    },
    componentWillMount () {
        document.title = "LIMS Customers"
    },

    componentWillMount() {

        // this Meteor call checks if the user is allowed to see the Customer component
        // it gets back a boolean
        Meteor.call('canShow', 'Customers', function(error, result) {
            if(result !== undefined) {
                this.setState({
                    loadingCallback: false,
                    canShow: result
                })
            }
        }.bind(this))
    },

    // canShow function
    // is pushes to /app when you're not allowed to see Customer
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

        if (this.state.loadingCallback && !this.state.canShow) {
            return (
                <div className="container">
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <h3>Customers</h3>
                <div className="row">
                    <div className="col s12">
                        <nav className="light-blue">
                            <div className="nav-wrapper">
                                <ul>
                                    <li><Link to={'/customers/company'} activeClassName="active">Companies</Link></li>
                                    <li><Link to={'/customers/person'} activeClassName="active">People</Link></li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                </div>
                {this.props.children}
            </div>
        )
    }
})