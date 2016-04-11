const {Link, browserHistory} = ReactRouter;

CompanyEdit = React.createClass({

    // this component is used to show the company edit form
    // input: customerId
    // output: render Company edit UI with data

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            customer: {},
            customerLoading: true,
            message: "loading...",
            errors: {}
        }
    },

    componentDidMount() {
        // sends request to GraphQL for "customer" query
        LIMSSchema.query(`
        {
            customer (id: "${this.props.params.customerId}")
            {
                _id,
                name,
                department,
                website,
                fax,
                phone,
                invoiceAddress {
                    street,
                    city,
                    zip,
                    country
                },
                shippingAddress {
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
                customer: result.customer,
                customerLoading: false,
                id: result.customer._id,
                inputName: result.customer.name,
                inputPhone: result.customer.phone,
                inputFax: result.customer.fax,
                inputDepartment: result.customer.department,
                inputWebsite: result.customer.website,
                invoiceStreet: result.customer.invoiceAddress ? result.customer.invoiceAddress.street : "",
                invoiceZip: result.customer.invoiceAddress ? result.customer.invoiceAddress.zip : "",
                invoiceCity: result.customer.invoiceAddress ? result.customer.invoiceAddress.city : "",
                invoiceCountry: result.customer.invoiceAddress ? result.customer.invoiceAddress.country : "",
                shippingStreet: result.customer.shippingAddress ? result.customer.shippingAddress.street : "" ,
                shippingZip: result.customer.shippingAddress ? result.customer.shippingAddress.zip : "",
                shippingCity: result.customer.shippingAddress ? result.customer.shippingAddress.city : "",
                shippingCountry: result.customer.shippingAddress ? result.customer.shippingAddress.country : ""
            });
        }, error => {
            // error of the request
            console.log('CompanyEdit error:', error);

            this.setState({
                message: error.reason
            });
        });

    },

    // onSubmit function
    // sends the data to GraphQL
    onSubmit (e) {
        e.preventDefault();
        // send request to GraphQL for "updateCompany" mutation
        LIMSSchema.mutate(`
            {
                updateCustomer (
                    id: "${this.state.id}",
                    name: "${this.state.inputName}",
                    phone: "${this.state.inputPhone}",
                    fax: "${this.state.inputFax}",
                    department: "${this.state.inputDepartment}",
                    website: "${this.state.inputWebsite}",
                    invoiceStreet: "${this.state.invoiceStreet}",
                    invoiceCity: "${this.state.invoiceCity}",
                    invoiceZip: ${Number(this.state.invoiceZip)},
                    invoiceCountry: "${this.state.invoiceCountry}",
                    shippingStreet: "${this.state.shippingStreet}",
                    shippingCity: "${this.state.shippingCity}",
                    shippingZip: ${Number(this.state.shippingZip)},
                    shippingCountry: "${this.state.shippingCountry}"
                )
                {
                    _id,
                    name
                }
            }
        `).then(result => {
            // result of the request
            if(result.updateCustomer._id !== undefined || result.updateCustomer._id > 0) {
                browserHistory.push(`/customers/company/${result.updateCustomer._id}`)
            }
        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        });

    },

    render () {
        if (this.state.customerLoading){
            return (<p>{this.state.message}</p>);
        }
        return (
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <form onSubmit={this.onSubmit}>
                    <AuthErrors errors={this.state.errors} />
                    <div className="row">
                        <div className="col s6">
                            <h5>Edit Company</h5>
                            <div className="input-field">
                                <label className="active" htmlFor="name">Name</label>
                                <input type="text" id="name" valueLink={this.linkState('inputName')} className="validate" />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">phone</i>
                                <input type="text" id="phone" valueLink={this.linkState('inputPhone')} />
                                <label className="active" htmlFor="phone">Phone</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="fax" valueLink={this.linkState('inputFax')} />
                                <label className="active" htmlFor="fax">Fax</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="department" valueLink={this.linkState('inputDepartment')} />
                                <label className="active" htmlFor="department">Department</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="website" valueLink={this.linkState('inputWebsite')} />
                                <label className="active" htmlFor="website">Website</label>
                            </div>

                        </div>
                        <div className="col s3">
                            <h5>Invoice</h5>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="invoiceStreet" valueLink={this.linkState('invoiceStreet')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="invoiceZip" valueLink={this.linkState('invoiceZip')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('invoiceCity')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceCountry">Country</label>
                                <input type="text" id="invoiceCountry" valueLink={this.linkState('invoiceCountry')} />
                            </div>

                        </div>
                        <div className="col s3">
                            <h5>Shipping</h5>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="invoiceStreet" valueLink={this.linkState('shippingStreet')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="invoiceZip" valueLink={this.linkState('shippingZip')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('shippingCity')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceCountry">Country</label>
                                <input type="text" id="invoiceCountry" valueLink={this.linkState('shippingCountry')} />
                            </div>

                        </div>
                    </div>

                    <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                        <a className="btn-floating btn-large red">
                            <i className="large mdi-navigation-menu"></i>
                        </a>
                        <ul>
                            <li><Link to={`/customers/company/${this.props.params.customerId}`} className="btn-floating red"><i className="material-icons">cancel</i></Link></li>
                            <li><button type="submit" className="btn-floating green"><i className="material-icons">save</i></button></li>
                        </ul>
                    </div>
                </form>
            </div>

        )
    }
})