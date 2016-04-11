App = React.createClass({

    // this shows the component App
    // this component is used to define the structure off the application
    //input: -
    //output: render App

    render() {
        return (
            <div>
                <SideNav />
                <main>
                    {this.props.children}
                </main>

            </div>
        )
    }
})