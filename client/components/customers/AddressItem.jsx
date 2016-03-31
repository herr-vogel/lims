AddressItem = React.createClass({

    propTypes: {
        address: React.PropTypes.object
    },

    render() {
        return (
            <address>
                {this.props.address ? this.props.address.street : ""}<br />
                {this.props.address ? this.props.address.zip : ""} {this.props.address ? this.props.address.city : ""}<br />
                {this.props.address ? this.props.address.country : ""}
            </address>
        );
    }
});