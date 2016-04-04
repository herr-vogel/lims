const {Link,browserHistory} = ReactRouter;


Customer = React.createClass({

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
        Meteor.call('canShow', 'Customers', function(error, result) {
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