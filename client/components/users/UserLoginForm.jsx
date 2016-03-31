const {browserHistory} = ReactRouter

UserLoginForm = React.createClass({

    // Dies ist die Login Form die bei /login angezeigt wird.

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            isAuthenticated: Meteor.userId() !== null
        }
    },

    //Wenn der User eingelogt ist wird er auf /app weitergeleitet.

    componentWillMount() {
        document.title = "Login"

        if (this.data.isAuthenticated) {
            browserHistory.push('/app');
        }
    },

    componentDidUpdate (prevProps, prevState) {
        if (this.data.isAuthenticated) {
            browserHistory.push('/app');
        }
    },

    getInitialState() {
        return {
            errors: {}
        }
    },

    onSubmit(e) {
        e.preventDefault();

        var email = e.target.email.value;
        var password = e.target.password.value;

        var errors = {};

        if (!email) {
            errors.email = "Email required"
        }

        if (!password) {
            errors.password = "Password required"
        }

        if (!_.isEmpty(errors)) {
            return;
        }

        Meteor.loginWithPassword(email, password, function(err) {
            if (err) {
                console.log('loginWithPassword Error: ' + err.reason);
                this.setState({
                    errors: {'none': err.reason}
                })


            } else {
                browserHistory.push('/app');

            }
        }.bind(this));

    },

    render () {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-panel light-blue z-depth-0">
                        <h5 className="white-text">Login</h5>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="card-content">
                            {/* Wenn eine Fehler aus dem Callback der loginWithPassword Funktion kommt, wird sie mit dieser Komponente dargestellt */}
                            <AuthErrors errors={this.state.errors} />
                            <div className="row">
                                <div className="input-field col s6">
                                    <input id="email" type="email" className="validate" />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-field col s6">
                                    <input id="password" type="password" className="validate" />
                                    <label htmlFor="password" >Password</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-action">
                            <div className="row">
                                <div className="col s12 right-align">
                                    <button className="btn waves-effect waves-light  teal accent-4" type="submit">login</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }


})