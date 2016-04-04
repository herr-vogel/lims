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
                    <Route path="/customers" component={Customer}>
                        <Route path="company" component={Company}>
                            <IndexRoute component={CompanyList} />
                            <Route path="add" component={CompanyAdd} />
                            <Route path=":customerId" component={CompanyDetail} />
                            <Route path=":customerId/edit" component={CompanyEdit} />
                        </Route>
                        <Route path="person" component={Person}>
                            <IndexRoute component={PersonList} />
                            <Route path="add" component={PersonAdd} />
                            <Route path=":personId" component={PersonDetail} />
                            <Route path=":personId/edit" component={PersonEdit} />
                        </Route>
                    </Route>
                    <Route path="/admin" component={Admin}>
                        <IndexRoute component={UserList} />
                        <Route path="add" component={UserAdd} />
                        <Route path=":userId" component={UserDetail} />
                        <Route path=":userId/edit" component={UserEdit} />
                    </Route>
                </Route>
                <Route path="*" component={App}>
                    <IndexRoute component={PageNotFound} />
                </Route>
            </Router>
        )
    }
});

