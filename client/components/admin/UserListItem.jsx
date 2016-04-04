const {Link} = ReactRouter;

UserListItem = React.createClass({

    propTypes: {
        user: React.PropTypes.object.isRequired,
        removeFunc: React.PropTypes.func.isRequired
    },

    render () {

        if(this.props.user.roles.defaultGroup === "admin") {
            return (
                <tr>
                    <td>
                        <Link to={`/admin/${this.props.user._id}`}>{this.props.user.profile.name}</Link>
                    </td>
                    <td>
                        {this.props.user.username}
                    </td>
                    <td>
                        {this.props.user.emails[0].address}
                    </td>
                    <td>
                        {this.props.user.roles.defaultGroup}
                    </td>
                    <td>
                        <button className="btn disabled" onClick={this.props.removeFunc}><i className="material-icons">delete</i></button>
                    </td>
                </tr>
            )
        }

        return (
            <tr>
                <td>
                    <Link to={`/admin/${this.props.user._id}`}>{this.props.user.profile.name}</Link>
                </td>
                <td>
                    {this.props.user.username}
                </td>
                <td>
                    {this.props.user.emails[0].address}
                </td>
                <td>
                    {this.props.user.roles.defaultGroup}
                </td>
                <td>
                    <button className="btn waves-effect waves-light" onClick={this.props.removeFunc}><i className="material-icons">delete</i></button>
                </td>
            </tr>
        );
    }
})