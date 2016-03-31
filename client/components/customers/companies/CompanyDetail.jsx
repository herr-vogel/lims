const {Link, browserHistory} = ReactRouter;

CompanyDetail = React.createClass({

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

            this.setState({
                customer: result.customer,
                people: result.customer.people,
                loading: false
            });


        }, error => {
            console.log('CompanyDetail error:', error);
            this.setState({
                message: error.reason
            });
        });

    },

    removeCustomer: function () {

        LIMSSchema.mutate(`{
            deleteCustomer (
                id: "${this.props.params.customerId}"
            )
            {
                name
            }
        }`).then(result => {

            browserHistory.push("/customer/company");

        }, error => {
            this.setState({
                updateError: error.reason
            })
        });
    },

    renderPersons() {
        return this.state.people.map(function (person) {
            return <CompanyDetailPersonItem key={person._id} person={person} />
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
                        <table className="bordered highlight">
                            <tbody>
                            {this.renderPersons()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                    <Link to={`/customer/company/${this.props.params.customerId}/edit`} className="btn-floating btn-large red">
                        <i className="large material-icons">mode_edit</i>
                    </Link>
                    <ul>
                        <li><bnutton onClick={this.removeCustomer} className="btn-floating red"><i className="material-icons">delete</i></bnutton></li>
                    </ul>
                </div>

            </div>
        )
    }

})