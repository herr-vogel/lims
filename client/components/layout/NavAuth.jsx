const {Link} = ReactRouter;

NavAuth = React.createClass({



    getInitialState(){
        return {
            loadingCallback: true,
            components: []
        }
    },

    componentWillMount() {

        //Die Methode gibt ein Array mit den erlaubten Componenten zürück
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