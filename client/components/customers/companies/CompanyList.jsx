const {Link} = ReactRouter;

//Diese Komponente zeigt eine Tabelle mit allen Firmen.

CompanyList = React.createClass({

    getInitialState() {
        return {
            searchString: '',
            customers: [],
            loading: true,
            message: "loading..."
        }
    },

    componentDidMount() {

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

            this.setState({
                customers: result.customers,
                loading: false
            })
        }, error => {
            console.log('CompanyList error:', error);

            this.setState({
                message: error.reason
            });
        });
    },

    removeCustomer: function (customerId) {

        LIMSSchema.mutate(`{
            deleteCustomer (
                id: "${customerId}"
            )
            {
                name
            }
        }`).then(result => {

            var updateCustomers = this.state.customers;

            this.setState({
                customers: updateCustomers.filter(function (el) {
                    return el._id != customerId
                })
            })

        }, error => {
            this.setState({
                updateError: error.reason
            })
        });
    },

    componentWillMount () {
        document.title = "LIMS Companies"
    },

    handleSearchStringChange: function (e) {
        this.setState({searchString: e.target.value});
    },

    renderCompanies() {
        var filteredCompanies = this.state.customers,
            searchString = this.state.searchString.trim().toLowerCase();

        if (searchString.length > 0) {
            filteredCompanies = filteredCompanies.filter(function (l) {
                return JSON.stringify(l).toLowerCase().match(searchString);
            })
        }

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
                <table className="bordered highlight">
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
                    <Link className="btn-floating btn-large waves-effect waves-light red" to={"/customer/company/add"}><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }
})