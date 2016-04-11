const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnum,
    GraphQLInt,
    GraphQLEnumType
    } = GraphQL.types;

// here we define the Types of object we use for GraphQL

Customer = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        department: {type: GraphQLString},
        website: {type: GraphQLString},
        phone: {type: GraphQLString},
        fax: {type: GraphQLString},
        invoiceAddress: {type: Address},
        shippingAddress: {type: Address},
        people: {
            type: new GraphQLList(Person),
            resolve: function (aCustomer) {
                var myPromise = new Promise(function (resolve) {
                    var fetchedPersons = People.find({customer_id: aCustomer._id}).fetch();
                    if (fetchedPersons === undefined || fetchedPersons.length == 0) {
                        resolve([{
                            _id: "0",
                            salutation: "",
                            firstName: "",
                            lastName: "",
                            role: "",
                            fax: "",
                            phone: "",
                            mobile: "",
                            email: "",
                            customer_id: "",
                            privateAddress: {
                                "street": "",
                                "city": "",
                                "zip": "",
                                "country": ""
                            }
                        }]);
                    }
                    else {
                        resolve(fetchedPersons);
                    }
                });
                return myPromise;
            }
        }
    })
})

Person = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        _id: {type: GraphQLString},
        salutation: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        role: {type: GraphQLString},
        fax: {type: GraphQLString},
        phone: {type: GraphQLString},
        mobile: {type: GraphQLString},
        email: {type: GraphQLString},
        privateAddress: {type: Address},
        customer: {
            type: Customer,
            resolve: function (aPerson) {

                // Skip MongoDB search for customer if customer is already filled.
                // This might be the case for some queries, e.g. 'people' (uses MongoDB aggregate $lookup operator)
                if (aPerson.customer)
                    return aPerson.customer;

                var myPromise = new Promise(function (resolve) {
                    var fetchedCustomer = Customers.findOne({_id: aPerson.customer_id});
                    if (fetchedCustomer === undefined || fetchedCustomer.length == 0) {
                        resolve({
                            _id: "0",
                            name: "",
                            department: "",
                            website: "",
                            phone: "",
                            fax: "",
                            invoiceAddress: {
                                "street": "",
                                "city": "",
                                "zip": "",
                                "country": ""
                            },
                            shippingAddress: {
                                "street": "",
                                "city": "",
                                "zip": "",
                                "country": ""
                            }
                        });
                    }
                    else {
                        resolve(fetchedCustomer);
                    }
                });
                return myPromise;
            }
        }
    })
});

Address = new GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        street: {type: GraphQLString},
        city: {type: GraphQLString},
        zip: {type: GraphQLInt},
        country: {type: GraphQLString}
    })
});

//User

UserEmail = new GraphQLObjectType({
    name: 'UserEmail',
    fields: () => ({
        address: {type: GraphQLString},
        verified: {type: GraphQLString}
    })
});

Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        name: {type: GraphQLString}
    })
});

Group = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        defaultGroup: {type: GraphQLString}
    })
});

User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLString},
        username: {type: GraphQLString},
        emails: {type: new GraphQLList(UserEmail)},
        profile: {type: Profile},
        roles: {type: Group}
    })
});

Component = new GraphQLObjectType({
    name: 'Component',
    fields: () => ({
        name: {type: GraphQLString}
    })
});

Action = new GraphQLObjectType({
    name: 'Action',
    fields: () => ({
        name: {type: GraphQLString}
    })
});

Permission = new GraphQLObjectType({
    name: 'Permission',
    fields: () => ({
        _id: {type: GraphQLString},
        role: {type: GraphQLString},
        components: {type: new GraphQLList(Component)},
        allowed: {type: new GraphQLList(Action)}
    })
});