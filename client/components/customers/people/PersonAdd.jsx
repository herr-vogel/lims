const {Link, browserHistory} = ReactRouter;

PersonAdd = React.createClass({

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            customers: {},
            loadingCustomers: true,
            selectedCustomer: "",
            salutation: "",
            firstName: "",
            lastName: "",
            role: "",
            fax: "",
            phone: "",
            mobile: "",
            email: "",
            privateStreet: "",
            privateCity: "",
            privateZip: "",
            privateCountry: "",
            errors: {}
        }
    },

    componentDidMount() {

        LIMSSchema.query(`
        {
            customers {
                _id,
                name
            }
        }
      `).then(result => {
            var customers = result.customers,
                customerOptions = [];

            customerOptions.push({value: "", label: "No Company"})

            customers.map(function(customer){
                var input = {value: customer._id, label: customer.name};
                customerOptions.push(input);
            });
            this.setState({
                customers: result.customers,
                loadingCustomers: false,
                customerOptions: customerOptions
            });
        }, error => {
            console.log('PersonAdd error:', error);

            this.setState({
                message: error.reason
            });
        });
    },

    logChange(val) {
        this.setState({
            selectedCustomer: val
        })
    },

    onSubmit (e) {
        e.preventDefault();

        LIMSSchema.mutate(`
            {
                insertPerson (
                    salutation: "${this.state.salutation}",
                    firstName: "${this.state.firstName}",
                    lastName: "${this.state.lastName}",
                    role: "${this.state.role}",
                    fax: "${this.state.fax}",
                    phone: "${this.state.phone}",
                    mobile: "${this.state.mobile}",
                    email: "${this.state.email}",
                    privateStreet: "${this.state.privateStreet}",
                    privateCity: "${this.state.privateCity}",
                    privateZip: "${this.state.privateZip}",
                    privateCountry: "${this.state.privateCountry}",
                    customerId: "${this.state.selectedCustomer}"
                )
                {
                    _id
                }
            }
        `).then(result => {

            if(result.insertPerson._id !== undefined || result.insertPerson._id > 0) {
                browserHistory.push(`/customers/person/${result.insertPerson._id}`)
            }
        }, error => {
            this.setState({
                updateError: error.reason
            })
        });

    },

    render() {
        if (this.state.loadingCustomers) {
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
                        <div className="col l6">
                            <h5>Add Person</h5>
                            <div className="input-field">
                                <i className="material-icons prefix">account_circle</i>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" valueLink={this.linkState('firstName')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">account_circle</i>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" valueLink={this.linkState('lastName')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="salutation">Salutation</label>
                                <input type="text" id="salutation" valueLink={this.linkState('salutation')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="role">Role</label>
                                <input type="text" id="role" valueLink={this.linkState('role')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="selectCompany">Company</label>
                                <Select
                                    value={"No Company"}
                                    options={this.state.customerOptions}
                                    onChange={this.logChange}
                                    id="company"
                                />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">phone</i>
                                <label htmlFor="phone">Phone</label>
                                <input type="text" id="phone" valueLink={this.linkState('phone')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">phone</i>
                                <label htmlFor="mobile">Mobile</label>
                                <input type="text" id="mobile" valueLink={this.linkState('mobile')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="fax">Fax</label>
                                <input type="text" id="fax" valueLink={this.linkState('fax')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">email</i>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" valueLink={this.linkState('email')} />
                            </div>
                        </div>

                        <div className="col l6">
                            <h5>Private</h5>
                            <div className="input-field">
                                <label htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="privateStreet" valueLink={this.linkState('privateStreet')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="privateZip" valueLink={this.linkState('privateZip')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('privateCity')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="privateCountry">Country</label>
                                <input type="text" id="privateCountry" valueLink={this.linkState('privateCountry')} />
                            </div>
                        </div>
                    </div>

                    <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                        <a className="btn-floating btn-large red">
                            <i className="large mdi-navigation-menu"></i>
                        </a>
                        <ul>
                            <li><Link to={"/customers/person"} className="btn-floating red"><i className="material-icons">cancel</i></Link></li>
                            <li><button type="submit" className="btn-floating green"><i className="material-icons">save</i></button></li>
                        </ul>
                    </div>
                </form>
            </div>
        )
    }


})