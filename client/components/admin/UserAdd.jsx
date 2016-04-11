const {Link, browserHistory} = ReactRouter;

UserAdd = React.createClass({

    // this component is used to render the user add form
    // input: -
    // output: render User Add form

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            inputName: "",
            inputUsername: "",
            inputEmail: "",
            inputPassword: "",
            inputCheckboxAdmin: false,
            inputCheckboxUser: true,
            errors: {}
        }
    },

    // onSubmit function
    // sends the data to GraphQL

    onSubmit(e) {
        e.preventDefault()

        var roles = [];

        if(this.state.inputCheckboxAdmin) {
            roles.push('admin');
        }

        if(this.state.inputCheckboxUser) {
            roles.push('user');
        }

        // sends request to GraphQL for "insertUser" mutation
        LIMSSchema.mutate(`
        {
            insertUser (
                name: "${this.state.inputName}",
                username: "${this.state.inputUsername}",
                email: "${this.state.inputEmail}",
                password: "${this.state.inputPassword}",
                roles: "${roles}"
            )
            {
                _id
            }
        }
        `).then (result => {
            // result of the request
            if(result.insertUser._id !== undefined || result.insertUser._id > 0) {
                browserHistory.push(`/admin/${result.insertUser._id}`);
            }
        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        })

    },

    render() {
        return(
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col l12">
                            <h5>Add User</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6">
                            <div className="input-field">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" valueLink={this.linkState('inputName')} />
                            </div>
                        </div>
                        <div className="col l6">
                            <div className="input-field">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" valueLink={this.linkState('inputUsername')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l6">
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" valueLink={this.linkState('inputEmail')} className="validate"/>
                            </div>
                        </div>
                        <div className="col l6">
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input type="text" id="password" valueLink={this.linkState('inputPassword')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l12">
                            <p>Roles:</p>
                        </div>
                    </div>
                    <div className="row">
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