const {Link} = ReactRouter;

CompanyListItem = React.createClass({

    // this component is used to render a table row for a company
    // input: company, removeFunc
    // output render table row with company data

    propTypes: {
        company: React.PropTypes.object.isRequired,
        removeFunc: React.PropTypes.func.isRequired
    },
    
    render() {
        if (this.props.company._id === "0"){
            return<tr></tr>
        }
        return(
            <tr>
                <td>
                    <Link to={`/customers/company/${this.props.company._id}`}> {this.props.company.name} </Link>
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