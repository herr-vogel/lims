Company = React.createClass({

    componentWillMount () {
        document.title = "LIMS Companies"
    },

    render() {
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
})