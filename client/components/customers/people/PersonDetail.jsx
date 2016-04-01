const {Link, browserHistory} = ReactRouter;

PersonDetail = React.createClass({

    getInitialState() {
        return {
            person: {},
            loading: true,
            message: "loading..."
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
                }

            }
        `).then(result => {
            this.setState({
                person: result.person,
                loading: false
            });
        }, error => {
            this.setState({
                message: error.reason
            });
        });

    },

    removePerson: function () {

        LIMSSchema.mutate(`{
            deletePerson (
                id: "${this.props.params.personId}"
            )
            {
                name
            }
        }`).then(result => {

            browserHistory.push("/customers/person");

        }, error => {
            this.setState({
                updateError: error.reason
            })
        });
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
                        <h3>{this.state.person.salutation} {this.state.person.firstName} {this.state.person.lastName}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">Company:</div>
                    <div className="col l10">{this.state.person.customer._id != "0" || this.state.person.customer ?  <Link to={`/customers/company/${this.state.person.customer._id}`}> {this.state.person.customer.name} </Link> : ""}</div>
                </div>
                <div className="row">
                    <div className="col l2">Role</div>
                    <div className="col l10">{this.state.person.role}</div>
                </div>
                <div className="row">
                    <div className="col l2">Phone</div>
                    <div className="col l10">{this.state.person.phone}</div>
                </div>
                <div className="row">
                    <div className="col l2">Mobile</div>
                    <div className="col l10">{this.state.person.mobile}</div>
                </div>
                <div className="row">
                    <div className="col l2">Fax</div>
                    <div className="col l10">{this.state.person.fax}</div>
                </div>
                <div className="row">
                    <div className="col l2">Email</div>
                    <div className="col l10"><a href={`mailto:${this.state.person.email}`}>{this.state.person.email}</a></div>
                </div>

                <div className="row">
                    <div className="col l12">
                        <h5>Addresses</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col l2">
                        <h6>Invoice</h6>
                        <AddressItem address={this.state.person.privateAddress}/>
                    </div>
                </div>
                <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                    <Link to={`/customers/person/${this.props.params.personId}/edit`} className="btn-floating btn-large red">
                        <i className="large material-icons">mode_edit</i>
                    </Link>
                    <ul>
                        <li><button onClick={this.removePerson} className="btn-floating red"><i className="material-icons">delete</i></button></li>
                    </ul>
                </div>

            </div>
        )
    }
})