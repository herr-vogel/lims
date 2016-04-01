const {Link} = ReactRouter;

PersonList = React.createClass({

    getInitialState() {
        return {
            searchString: '',
            people: [],
            loading: true,
            message: "loading..."
        }
    },

    componentDidMount() {
        LIMSSchema.query(`
        {
            people {
                _id,
                email,
                salutation,
                firstName,
                lastName,
                role
                customer {
                    _id,
                    name
                }
                privateAddress {
                    street,
                    zip,
                    city,
                    country
                }
            }
        }
      `).then(result => {
            console.log(result.people)
            this.setState({
                people: result.people,
                loading: false
            });
        }, error => {
            console.log('PersonList error:', error);

            this.setState({
                message: error.reason
            });
        });
    },

    removePerson: function (personId) {

        LIMSSchema.mutate(`{
            deletePerson (
                id: "${personId}"
            )
            {
                name
            }
        }`).then(result => {

            var updatePersons = this.state.people;

            this.setState({
                people: updatePersons.filter(function (el) {
                    return el._id != personId
                })
            })

        }, error => {
            this.setState({
                updateError: error.reason
            })
        });
    },

    handleSearchStringChange: function (e) {
        this.setState({searchString: e.target.value});
    },

    renderPeople() {
        var filteredPeople = this.state.people,
            searchString = this.state.searchString.trim().toLowerCase();

        if (searchString.length > 0) {
            filteredPeople = filteredPeople.filter(function (l) {
                return JSON.stringify(l).toLowerCase().match(searchString);
            })

        }


        return filteredPeople.map(function (person) {
            return <PersonListItem key={person._id} person={person} removeFunc={this.removePerson.bind(null, person._id)} />;
        }.bind(this));
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
                        <th data-field="company">Company</th>
                        <th data-field="role">Role</th>
                        <th data-field="email">Email</th>
                        <th data-field="street">Street</th>
                        <th data-field="zip">Zip</th>
                        <th data-field="city">City</th>
                        <th data-field="country">Country</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.renderPeople()}
                    </tbody>
                </table>

                <div className="fixed-action-btn" style={{bottom: 45, right: 24}}>
                    <Link className="btn-floating btn-large waves-effect waves-light red" to={"/customers/person/add"}><i className="material-icons">add</i></Link>
                </div>
            </div>
        )
    }


})