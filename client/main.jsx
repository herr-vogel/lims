Meteor.startup(function () {
    // React renders the component Routes into the div with the Id "render-target" from index.html

    ReactDOM.render(<Routes />, document.getElementById('render-target'));
});