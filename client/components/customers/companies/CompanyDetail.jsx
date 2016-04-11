const {Link, browserHistory} = ReactRouter;

CompanyDetail = React.createClass({

    // this component is used to render the detail of a company
    // input: customerId
    // output: render UI with Company Detail

    getInitialState() {
        return {
            customer: {},
            people: [],
            loading: true,
            controlledModalOpen: false,
            personsLoading: true,
            message: "loading..."
        }
    },

    componentDidMount() {
        // sends request to GraphQL for "person" query
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
                people {
                    _id
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
                    }
                },
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
                people: result.customer.people,
                loading: false
            });


        }, error => {
            // error of the request
            console.log('CompanyDetail error:', error);
            this.setState({
                message: error.reason
            });
        });

    },

    // removePerson function
    removeCustomer: function () {
        // sends request to GraphQL for "deleteCustomer" mutation
        LIMSSchema.mutate(`{
            deleteCustomer (
                id: "${this.props.params.customerId}"
            )
            {
                name
            }
        }`).then(result => {
            // result of the request
            browserHistory.push("/customers/company");

        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        });
    },

    removeCustomerIdInPerson: function (personId) {
        // sends request to GraphQL for "removeCustomerIdInPerson" mutation
        LIMSSchema.mutate(`
            {
                removeCustomerIdInPerson (
                    personId: "${personId}"
                )
                {
                    _id
                }
            }
        `).then(result => {
            // result of the request
            var updatedPersons = this.state.people;

            this.setState({
                people: updatedPersons.filter(function (el) {
                    return el._id != personId
                })
            })
        }, error => {
            // error of the request
            this.setState({
                updateError: error.reason
            })
        });

    },

    renderPersons() {
        // returns <CompanyDetailPersonItem> for every person that is related to this company
        return this.state.people.map(function (person) {
            return <CompanyDetailPersonItem key={person._id} person={person} removeFunc={this.removeCustomerIdInPerson.bind(null, person._id)} />
        }.bind(this));
    },

    render () {
        if (this.state.loading)
            return (<p>{this.state.message}</p>);

        return (
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <div className="row">
                    <div className="col l12">
                        <h3>{this.state.customer.name}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">Phone:</div>
                    <div className="col l10">{this.state.customer.phone}</div>
                </div>
                <div className="row">
                    <div className="col l2">Fax:</div>
                    <div className="col l10">{this.state.customer.fax}</div>
                </div>
                <div className="row">
                    <div className="col l2">Department:</div>
                    <div className="col l10">{this.state.customer.department}</div>
                </div>
                <div className="row">
                    <div className="col l2">Website:</div>
                    <div className="col l10">{this.state.customer.website}</div>
                </div>
                <div className="row">
                    <div className="col l12">
                        <h5>Addresses</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">
                        <h6>Invoice</h6>
                        <AddressItem address={this.state.customer.invoiceAddress}/>
                    </div>
                    <div className="col l2">
                        <h6>Shipping</h6>
                        <AddressItem address={this.state.customer.shippingAddress}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col l12">
                        <h5>People</h5>
                        <table className="bordered highlight responsive-table">
                            <thead>
                                <th data-field="name">Name</th>
                                <th data-field="role">Role</th>
                                <th data-field="email">Email</th>
                                <th data-field="country">Country</th>
                                <th></th>
                            </thead>
                            <tbody>
                            {this.renderPersons()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                    <Link to={`/customers/company/${this.props.params.customerId}/edit`} className="btn-floating btn-large red">
                        <i className="large material-icons">mode_edit</i>
                    </Link>
                    <ul>
                        <li><button onClick={this.removeCustomer} className="btn-floating red"><i className="material-icons">delete</i></button></li>
                    </ul>
                </div>

            </div>
        )
    }

})