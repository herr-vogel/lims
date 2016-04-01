const {Link} = ReactRouter;

PersonListItem = React.createClass({

    PropTypes: {
        person: React.PropTypes.object.isRequired,
        removeFunc: React.PropTypes.func.isRequired
    },

    render () {

        if (this.props.person._id === "0"){
            return<tr></tr>
        }
        return (
            <tr>
                <td>
                    <Link to={`/customers/person/${this.props.person._id}`}>{this.props.person.firstName} {this.props.person.lastName}</Link>
                </td>
                <td>
                    {this.props.person.customer._id != "0" ?  <Link to={`/customers/company/${this.props.person.customer._id}`}>{this.props.person.customer.name}</Link> : ""}
                </td>
                <td>
                    {this.props.person.role}
                </td>
                <td>
                    <a href={`mailto:${this.props.person.email}`}>{this.props.person.email}</a>
                </td>
                <td>
                    {this.props.person.privateAddress.street}
                </td>
                <td>
                    {this.props.person.privateAddress.zip}
                </td>
                <td>
                    {this.props.person.privateAddress.city}
                </td>
                <td>
                    {this.props.person.privateAddress.country}
                </td>
                <td>
                    <button className="btn waves-effect waves-light" onClick={this.props.removeFunc}><i className="material-icons">delete</i></button>
                </td>
            </tr>
        );
    }

})