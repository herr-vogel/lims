Company = React.createClass({
    // this is the parent component for company
    // input: -
    // output: render Company

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