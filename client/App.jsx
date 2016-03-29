App = React.createClass({

    //Seiten Strucktur bestehend aus SideNav und main (Content)

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