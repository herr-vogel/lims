const {
    Router,
    Route,
    IndexRoute,
    Link,
    browserHistory
    } = ReactRouter;

Routes = React.createClass({

    //React Router Setup

    render: function () {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home} />
                    <Route path="login" component={UserLoginForm}/>
                </Route>
                <Route path="/app" component={AuthApp}>
                    <IndexRoute component={Home} />
                    <Route path="/customer" component={Customer}>
                        <Route path="company" component={Company}>
                            <IndexRoute component={CompanyList} />
                            <Route path="add" component={CompanyAdd} />
                            <Route path=":customerId" component={CompanyDetail} />
                            <Route path=":customerId/edit" component={CompanyEdit} />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" component={App}>
                    <IndexRoute component={PageNotFound} />
                </Route>
            </Router>
        )
    }
});

