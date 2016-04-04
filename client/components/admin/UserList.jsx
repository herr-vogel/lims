const {Link} = ReactRouter;

UserList = React.createClass({

    getInitialState() {
        return {
            searchString: '',
            message: "loading...",
            users: [],
            loading: true,
            permissions: []
        }
    },

    componentDidMount() {
        LIMSSchema.query(`
        {
            users {
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
        `).then(result => {

            this.setState({
                users: result.users,
                loading: false
            })
        }, error => {
            this.setState({
                message: error.reason
            });
        });

    },

    removeUser: function(userId) {
        LIMSSchema.mutate(`
        {
            deleteUser(
                id: "${userId}"
            )
            {
                _id
            }
        }
        `).then(result => {
            var updatedUsers = this.state.users;

            this.setState({
                users: updatedUsers.filter(function (el) {
                    return el._id != userId
                })
            })
        }, error => {
            this.setState({
                updateError: error.reason
            })
        })
    },

    handleSearchStringChange: function (e) {
        this.setState({searchString: e.target.value});
    },

    renderUser() {
        var filteredUsers = this.state.users,
            searchString = this.state.searchString.trim().toLowerCase();

        if (searchString.length > 0) {
            filteredUsers = filteredUsers.filter(function (l) {
                return JSON.stringify(l).toLowerCase().match(searchString);
            })

        }

        return filteredUsers.map(function (user) {
            return <UserListItem key={user._id} user={user} removeFunc={this.removeUser.bind(null, user._id)} />;
        }.bind(this));
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
                    <div className="input-field col s12">
                        <input id="search" type="text" value={this.state.searchString} onChange={this.handleSearchStringChange} />
                        <label htmlFor="search">Search</label>
                    </div>
                </div>
                <table className="bordered highlight responsive-table">
                    <thead>
                    <tr>
                        <th data-field="name">Name</th>
                        <th data-field="username">Username</th>
                        <th data-field="email">Email</th>
                        <th data-field="roles">Roles</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.renderUser()}
                    </tbody>

                </table>

                <div className="fixed-action-btn" style={{bottom: 45, right: 24}}>
                    <Link className="btn-floating btn-large waves-effect waves-light red" to={"admin/add"}><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }
})