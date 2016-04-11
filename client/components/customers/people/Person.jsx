Person = React.createClass({

    // this is the parent component for people
    // input: -
    // output: render Person

    componentWillMount () {
        document.title = "LIMS People"
    },

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
})