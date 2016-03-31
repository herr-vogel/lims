const {Link} = ReactRouter;

CompanyListItem = React.createClass({
    propTypes: {
        company: React.PropTypes.object.isRequired,
        removeFunc: React.PropTypes.func.isRequired
    },
    
    render() {
        return(
            <tr>
                <td>
                    <Link to={`/customer/company/${this.props.company._id}`}> {this.props.company.name} </Link>
                </td>
                <td>
                    {this.props.company.invoiceAddress.street}
                </td>
                <td>
                    {this.props.company.invoiceAddress.city}
                </td>
                <td>{
                    this.props.company.invoiceAddress.country}
                </td>
                <th>
                    <button className="btn waves-effect waves-light" onClick={this.props.removeFunc}><i className="material-icons">delete</i></button>
                </th>
            </tr>
        )
    }
})