const {Link} = ReactRouter;

NavAuth = React.createClass({

    // this component renders the nav links dynamically
    // input: -
    // output: render Nav links for the user roll

    getInitialState(){
        return {
            loadingCallback: true,
            components: []
        }
    },

    componentWillMount() {

        //This Meteor call gets the component the logged in user is allowed to see

        Meteor.call('getComponents', function (error, result) {

            if(result !== undefined) {
                this.setState({
                    loadingCallback: false,
                    components: result
                })

                console.log(result);
            }
        }.bind(this))
    },

    // returns a <li> element for every component

    renderNavLinks() {
        return this.state.components.map(function (component, index) {
            let componentLower = component.toLowerCase()
            return (
                <li key={index}><Link to={`/${componentLower}`} activeClassName="active" className="waves-effect waves-teal"><b>{component}</b></Link></li>
            )
        })
    },

    render() {
        if(this.state.loadingCallback){
            return null
        }

        return (
            <div>
                {this.renderNavLinks()}
            </div>
        )




    }

})