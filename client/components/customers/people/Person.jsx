Person = React.createClass({

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