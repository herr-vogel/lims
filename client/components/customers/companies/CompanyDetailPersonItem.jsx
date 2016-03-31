const {Link} = ReactRouter;

CompanyDetailPersonItem = React.createClass({

    propTypes: {
        person: React.PropTypes.object.isRequired
    },

    render() {

        if (this.props.person._id === "0"){
            return<tr></tr>
        }
        return (
            <tr>
                <td>
                    <Link to={`/customer/person/${this.props.person._id}`}>{this.props.person.salutation} {this.props.person.firstName} {this.props.person.lastName}</Link>
                </td>
                <td>
                    {this.props.person.role}
                </td>
                <td>
                    <a href="mailto:{this.state.person.email}">{this.props.person.email}</a>
                </td>
                <td>
                    {this.props.person.privateAddress ? this.props.person.privateAddress.country : ""}
                </td>
            </tr>

        );
    }
})