const {Link, browserHistory} = ReactRouter;

UserEdit = React.createClass({

    // this component is used to render the edit form for the user
    // input: userId
    // output: render User Edit form with data

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            user: {},
            loading: true,
            message: "loading..."
        }
    },

    componentWillMount() {
        // sends request to GraphQL for "user" query
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
            // result of the request

            var rolesArray = result.user.roles.defaultGroup.split(',')

            var adminCheckbox = false, userCheckbox = false;

            // fills the checkboxes

            if(rolesArray.indexOf('admin') > -1) {
                adminCheckbox = true
            }
            if(rolesArray.indexOf('user') > -1) {
                userCheckbox = true
            }

            this.setState({
                user: result.user,
                inputName: result.user.profile.name,
                inputUsername: result.user.username,
                inputEmail: result.user.emails[0].address,
                inputCheckboxAdmin: adminCheckbox,
                inputCheckboxUser: userCheckbox
            })
        }, error => {
            // error of the request
            this.setState({
                message: error.reason
            })
        })
    },

    // onSubmit function
    // sends the data to GraphQL

    onSubmit(e) {
       e.preventDefault();

        var roles = [];

        if(this.state.inputCheckboxAdmin) {
            roles.push('admin');
        }

        if(this.state.inputCheckboxUser) {
            roles.push('user');
        }

        // send request to GraphQL for "updateUser" mutation
        LIMSSchema.mutate(`
        {
            updateUser (
                id: "${this.props.params.userId}",
                name: "${this.state.inputName}",
                username: "${this.state.inputUsername}",
                email: "${this.state.inputEmail}",
                roles: "${roles}"
            )
            {
                _id
            }
        }`).then(result => {
            // result of the request
            if(result.updateUser._id !== undefined || result.updateUser._id > 0) {
                browserHistory.push(`/admin/${result.updateUser._id}`);
            }
        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        })

    },

    render() {
        if (this.state.customerLoading){
            return (<p>{this.state.message}</p>);
        }
        return(
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col l12">
                            <h5>Edit User</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6">
                            <div className="input-field">
                                <label className="active" htmlFor="name">Name</label>
                                <input type="text" id="name" valueLink={this.linkState('inputName')} />
                            </div>
                        </div>
                        <div className="col l6">
                            <div className="input-field">
                                <label className="active" htmlFor="username">Username</label>
                                <input type="text" id="username" valueLink={this.linkState('inputUsername')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6">
                            <div className="input-field">
                                <label className="active" htmlFor="email">Email</label>
                                <input type="email" id="email" valueLink={this.linkState('inputEmail')} className="validate"/>
                            </div>
                        </div>
                        <div className="col l3">
                            <p>
                                <input type="checkbox" id="admin" checkedLink={this.linkState('inputCheckboxAdmin')}/>
                                <label htmlFor="admin">Admin</label>
                            </p>
                        </div>
                        <div className="col l3">
                            <p>
                                <input type="checkbox" id="user" checkedLink={this.linkState('inputCheckboxUser')}/>
                                <label htmlFor="user">User</label>
                            </p>
                        </div>
                    </div>
                    <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                        <a className="btn-floating btn-large red">
                            <i className="large mdi-navigation-menu"></i>
                        </a>
                        <ul>
                            <li><Link to={"/admin"} className="btn-floating red"><i className="material-icons">cancel</i></Link></li>
                            <li><button type="submit" className="btn-floating green"><i className="material-icons">save</i></button></li>
                        </ul>
                    </div>
                </form>
            </div>
        )
    }
})