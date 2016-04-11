AuthErrors = React.createClass({

    // this component shows the errors from UserLoginForm
    // input: errors
    // output: render AuthErrors

    propTypes: {
        errors: React.PropTypes.object
    },

    render() {
        if (this.props.errors) {
            return (
                <ul>
                    {
                        _.values(this.props.errors).map((errorMessage) => {
                            return <li key={errorMessage}>{errorMessage}</li>;
                            })
                        }
                </ul>
            );
        }
    }
});