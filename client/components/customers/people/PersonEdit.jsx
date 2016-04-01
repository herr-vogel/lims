const {Link, browserHistory} = ReactRouter;

PersonEdit = React.createClass({

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            person: {},
            customers: {},
            loadingPerson: true,
            loadingCustomers: true,
            selectedCustomer: "",
            message: "loading...",
            errors: {}
        }
    },

    componentDidMount() {
        LIMSSchema.query(`
            {
                person (id: "${this.props.params.personId}")
                {
                    _id,
                    salutation,
                    firstName,
                    lastName,
                    role,
                    fax,
                    phone,
                    mobile,
                    email,
                    privateAddress {
                        street,
                        city,
                        zip,
                        country
                    },
                    customer {
                        _id,
                        name,
                    }
                },

                customers
                {
                    _id,
                    name
                }

            }
        `).then(result => {

            var customers = result.customers,
                customerOptions = [];

            customerOptions.push({value: "", label: "No Company"})

            customers.map(function (customer) {
                var input = {value: customer._id, label: customer.name};
                customerOptions.push(input);
            });

            this.setState({
                person: result.person,
                loadingPerson: false,
                id: result.person._id,
                salutation: result.person.salutation,
                firstName: result.person.firstName,
                lastName: result.person.lastName,
                role: result.person.role,
                fax: result.person.fax,
                phone: result.person.phone,
                mobile: result.person.mobile,
                email: result.person.email,
                privateStreet: result.person.privateAddress.street,
                privateCity: result.person.privateAddress.city,
                privateZip: result.person.privateAddress.zip,
                privateCountry: result.person.privateAddress.country,
                selectedCustomer: result.person.customer._id,
                customers: result.customers,
                loadingCustomers: false,
                customerOptions: customerOptions
            });
        }, error => {

            console.log('PersonEdit error:', error);

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
                updatePerson (
                    id: "${this.state.id}",
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

            if(result.updatePerson._id !== undefined || result.updatePerson._id > 0) {
                this.props.history.pushState(null, `/customers/person/${result.updatePerson._id}`);
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
                                <label className="active" htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" valueLink={this.linkState('firstName')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">account_circle</i>
                                <label className="active" htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" valueLink={this.linkState('lastName')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="salutation">Salutation</label>
                                <input type="text" id="salutation" valueLink={this.linkState('salutation')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="role">Role</label>
                                <input type="text" id="role" valueLink={this.linkState('role')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="selectCompany">Company</label>
                                <Select
                                    value={this.state.selectedCustomer}
                                    options={this.state.customerOptions}
                                    onChange={this.logChange}
                                    id="company"
                                />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">phone</i>
                                <label className="active" htmlFor="phone">Phone</label>
                                <input type="text" id="phone" valueLink={this.linkState('phone')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">phone</i>
                                <label className="active" htmlFor="mobile">Mobile</label>
                                <input type="text" id="mobile" valueLink={this.linkState('mobile')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="fax">Fax</label>
                                <input type="text" id="fax" valueLink={this.linkState('fax')} />
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">email</i>
                                <label className="active" htmlFor="email">Email</label>
                                <input type="text" id="email" valueLink={this.linkState('email')} />
                            </div>
                        </div>

                        <div className="col l6">
                            <h5>Private</h5>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="privateStreet" valueLink={this.linkState('privateStreet')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="privateZip" valueLink={this.linkState('privateZip')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('privateCity')} />
                            </div>
                            <div className="input-field">
                                <label className="active" htmlFor="privateCountry">Country</label>
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