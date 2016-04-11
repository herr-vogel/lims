const {Link} = ReactRouter;

CompanyList = React.createClass({

    // this component is used to show a list of all companies in a table
    // input: -
    // output: render CompanyList

    getInitialState() {
        return {
            searchString: '',
            customers: [],
            loading: true,
            message: "loading..."
        }
    },

    componentDidMount() {
        // sends request to GraphQL for "customers" query
        LIMSSchema.query(`
        {
            customers {
                _id,
                name,
                website,
                invoiceAddress {
                    street,
                    city,
                    zip,
                    country
                }
            }
        }
      `).then(result => {
            // result of the request
            this.setState({
                customers: result.customers,
                loading: false
            })
        }, error => {
            console.log('CompanyList error:', error);
            // error of the request
            this.setState({
                message: error.reason
            });
        });
    },

    removeCustomer: function (customerId) {
        // sends request to GraphQL for "deleteCustomer" mutation
        LIMSSchema.mutate(`{
            deleteCustomer (
                id: "${customerId}"
            )
            {
                name
            }
        }`).then(result => {
            // result of the request
            var updateCustomers = this.state.customers;

            this.setState({
                customers: updateCustomers.filter(function (el) {
                    return el._id != customerId
                })
            })

        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        });
    },

    // handleSearchStringChange function
    // updates the value of searchString
    handleSearchStringChange: function (e) {
        this.setState({searchString: e.target.value});
    },

    // renderCompany function
    // filters matching companies
    renderCompanies() {
        var filteredCompanies = this.state.customers,
            searchString = this.state.searchString.trim().toLowerCase();

        if (searchString.length > 0) {
            filteredCompanies = filteredCompanies.filter(function (l) {
                return JSON.stringify(l).toLowerCase().match(searchString);
            })
        }
        // returns <CompanyListItem> for every Company

        return filteredCompanies.map(function(company) {
            return <CompanyListItem key={company._id} company={company} removeFunc={this.removeCustomer.bind(null, company._id)} />;
        }.bind(this))
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
                            <th data-field="street">Street</th>
                            <th data-field="city">City</th>
                            <th data-field="country">Country</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                    {this.renderCompanies()}
                    </tbody>
                </table>

                <div className="fixed-action-btn" style={{bottom: 45, right: 24}}>
                    <Link className="btn-floating btn-large waves-effect waves-light red" to={"/customers/company/add"}><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }
})