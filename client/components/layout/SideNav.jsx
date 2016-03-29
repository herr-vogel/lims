const {Link} = ReactRouter;

SideNav = React.createClass({

    //Diese Componente ist das gerüst für die Seitennavigation.

    componentDidMount() {
        $(".button-collapse").sideNav();
    },

    render() {
        return (
            <nav className="light-blue">
                <ul id="slide-out" className="side-nav fixed collapsible" data-collapsible="accordion">
                    <li><LoginButtons history={this.props.history}/></li>
                    <li><Link to="/" activeClassName="active" className="waves-effect waves-teal"><b>Home</b></Link></li>
                    {/*Diese Componente ist zuständig für das dynamische darstelen der Links für die dazugehörigen Rollen */}
                    <NavAuth />
                </ul>
                <a href="#" data-activates="slide-out" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
            </nav>
        )
    }
})