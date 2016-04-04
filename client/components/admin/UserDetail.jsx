const {Link, browserHistory} = ReactRouter;


UserDetail = React.createClass({

    getInitialState() {
        return {
            user: {},
            loading: true,
            message: "loading..."
        }
    },

    componentDidMount() {
        LIMSSchema.query(`
        {
            user (
                id: "${this.props.params.userId}"
            )
            {
                _id,
                username,
                emails {
                    address,
                    verified
                },
                profile {
                    name
                },
                roles {
                    defaultGroup
                }
            }
        }
        `).then( result => {

            this.setState({
                user: result.user,
                loading: false
            })
        }, error => {
            this.setState({
                message: error.reason
            })
        })
    },

    removeUser: function() {
        LIMSSchema.mutate(`
        {
            deleteUser(
                id: "${this.props.params.userId}"
            )
            {
                _id
            }
        }
        `).then(result => {
            browserHistory.push("/admin")
        }, error => {
            this.setState({
                updateError: error.reason
            })
        })
    },

    render() {
        if (this.state.loading) {
            return (<p>{this.state.message}</p>);
        }

        return (
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <div className="row">
                    <div className="col l12">
                        <h3>{this.state.user.profile.name}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">
                        Username:
                    </div>
                    <div className="col l10">
                        {this.state.user.username}
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">
                        Email:
                    </div>
                    <div className="col l10">
                        {this.state.user.emails[0].address}
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">
                        Roles:
                    </div>
                    <div className="col l10">
                        {this.state.user.roles ? this.state.user.roles.defaultGroup : "no Roles"}
                    </div>
                </div>
                <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                    <Link to={`/admin/${this.props.params.userId}/edit`} className="btn-floating btn-large red">
                        <i className="large material-icons">mode_edit</i>
                    </Link>
                    <ul>
                        {this.state.user.roles.defaultGroup === 'admin' ?  <li><button onClick={this.removeUser} className="btn-floating red disabled"><i className="material-icons">delete</i></button></li> :
                        <li><button onClick={this.removeUser} className="btn-floating red"><i className="material-icons">delete</i></button></li>}
                    </ul>
                </div>
            </div>
        )
    }
})