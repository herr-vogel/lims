const {Link, browserHistory} = ReactRouter;

CompanyAdd = React.createClass({

    mixins: [LinkedStateMixin],

    getInitialState() {
        return {
            inputName: "",
            inputPhone: "",
            inputFax: "",
            inputDepartment: "",
            inputWebsite: "",
            invoiceStreet: "",
            invoiceZip: "",
            invoiceCity: "",
            invoiceCountry: "" ,
            shippingStreet: "" ,
            shippingZip: "",
            shippingCity: "",
            shippingCountry: "",
            errors: {}
        }
    },

    onSubmit (e) {
        e.preventDefault();

        LIMSSchema.mutate(`
            {
                insertCustomer (
                    name: "${this.state.inputName}",
                    phone: "${this.state.inputPhone}",
                    fax: "${this.state.inputFax}",
                    department: "${this.state.inputDepartment}",
                    website: "${this.state.inputWebsite}",
                    invoiceStreet: "${this.state.invoiceStreet}",
                    invoiceCity: "${this.state.invoiceCity}",
                    invoiceZip: "${this.state.invoiceZip}",
                    invoiceCountry: "${this.state.invoiceCountry}",
                    shippingStreet: "${this.state.shippingStreet}",
                    shippingCity: "${this.state.shippingCity}",
                    shippingZip: "${this.state.shippingZip}",
                    shippingCountry: "${this.state.shippingCountry}"
                )
                {
                    _id
                }
            }
        `).then(result => {
            console.log(result.insertCustomer);

            if(result.insertCustomer._id !== undefined || result.insertCustomer._id > 0) {
                browserHistory.push(`/customer/company/${result.insertCustomer._id}`);
            }
            else {
                this.setState({
                    errors: {'none': result.insertCustomer}
                })
            }

        }, error => {
            this.setState({
                updateError: error.reason
            })
        });

    },

    render () {
        return (
            <div className="card-panel">
                {this.state.updateError ? <ul>
                    <li>{this.state.updateError}</li>
                </ul> : false}
                <form onSubmit={this.onSubmit}>
                    <AuthErrors errors={this.state.errors} />
                    <div className="row">
                        <div className="col s6">
                            <h5>Add Company</h5>
                            <div className="input-field">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" valueLink={this.linkState('inputName')} className="validate" />
                            </div>
                            <div className="input-field">
                                <input type="text" id="phone" valueLink={this.linkState('inputPhone')} />
                                <label htmlFor="phone">Phone</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="fax" valueLink={this.linkState('inputFax')} />
                                <label htmlFor="fax">Fax</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="department" valueLink={this.linkState('inputDepartment')} />
                                <label htmlFor="department">Department</label>
                            </div>
                            <div className="input-field">
                                <input type="text" id="website" valueLink={this.linkState('inputWebsite')} />
                                <label htmlFor="website">Website</label>
                            </div>

                        </div>
                        <div className="col s3">
                            <h5>Invoice</h5>
                            <div className="input-field">
                                <label htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="invoiceStreet" valueLink={this.linkState('invoiceStreet')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="invoiceZip" valueLink={this.linkState('invoiceZip')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('invoiceCity')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceCountry">Country</label>
                                <input type="text" id="invoiceCountry" valueLink={this.linkState('invoiceCountry')} />
                            </div>

                        </div>
                        <div className="col s3">
                            <h5>Shipping</h5>
                            <div className="input-field">
                                <label htmlFor="invoiceStreet">Street</label>
                                <input type="text" id="invoiceStreet" valueLink={this.linkState('shippingStreet')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceZip">Zip</label>
                                <input type="text" id="invoiceZip" valueLink={this.linkState('shippingZip')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceCity">City</label>
                                <input type="text" id="invoiceCity" valueLink={this.linkState('shippingCity')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="invoiceCountry">Country</label>
                                <input type="text" id="invoiceCountry" valueLink={this.linkState('shippingCountry')} />
                            </div>

                        </div>
                    </div>

                    <div className="fixed-action-btn horizontal" style={{bottom: 45, right: 24}}>
                        <a className="btn-floating btn-large red">
                            <i className="large mdi-navigation-menu"></i>
                        </a>
                        <ul>
                            <li><Link to={"/customer/company"} className="btn-floating red"><i className="material-icons">cancel</i></Link></li>
                            <li><button type="submit" className="btn-floating green"><i className="material-icons">save</i></button></li>
                        </ul>
                    </div>
                </form>
            </div>

        )
    }
})