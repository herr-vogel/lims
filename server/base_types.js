const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnum,
    GraphQLEnumType
    } = GraphQL.types;

//Hier werden die Typen von Objekten für GraphQL definiert

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
                        resolve([People.findOne({_id: "0"})]);
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
                        resolve([Customers.findOne({_id: "0"})]);
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
        zip: {type: GraphQLString},
        country: {type: GraphQLString}
    })
});