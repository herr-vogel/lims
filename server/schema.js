const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
    } = GraphQL.types;

//Diese Function checkt ob der User dieser Query abfragen oder diese Mutation ausführen darf und gibt einen Boolean zurück.
function canExecute(rootValue, args, info) {
    var roles = Roles.getRolesForUser(rootValue.userId, DEFAULT_GROUP);
    var allowedQueries = [];
    roles.map(function (role) {
        var perm = Permissions.findOne({role: role});
        perm.allowed.map(function (query) {
            allowedQueries.push(query.name);
        });
    });
    var _canExecute = (allowedQueries.indexOf(info.fieldName) >= 0)
    if (!_canExecute) {
        console.log('user ', rootValue.userId , ' cannot execute ', info.operation.operation, ': ', info.fieldName);
    }
    return _canExecute;
}

//Hier werden die Queries definiert.

const query = new GraphQLObjectType({
    name: 'LIMSQueries',
    fields: () => ({
        customers: {
            type: new GraphQLList(Customer),
            args: {
                limit: {type: GraphQLInt}
            },
            resolve(rootValue, args, info) {

                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );

                return Promise.resolve(Customers.find({}, {limit: args.limit}).fetch());
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name: 'LIMSMutations',
    fields: () => ({
        updateCustomer: {
            type: Customer,
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
                customerCode: {type: GraphQLString},
                department: {type: GraphQLString},
                website: {type: GraphQLString},
                phone: {type: GraphQLString},
                fax: {type: GraphQLString},
                invoiceStreet: {type: GraphQLString},
                invoiceCity: {type: GraphQLString},
                invoiceZip: {type: GraphQLString},
                invoiceCountry: {type: GraphQLString},
                shippingStreet: {type: GraphQLString},
                shippingCity: {type: GraphQLString},
                shippingZip: {type: GraphQLString},
                shippingCountry: {type: GraphQLString}

            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                let id = args.id;
                Promise.resolve(Customers.update({"_id": args.id},
                    {
                        $set: {
                            "name": args.name,
                            "customer_code": args.customerCode,
                            "department": args.department,
                            "website": args.website,
                            "phone": args.phone,
                            "fax": args.fax,
                            "invoiceAddress.street": args.invoiceStreet,
                            "invoiceAddress.city": args.invoiceCity,
                            "invoiceAddress.zip": args.invoiceZip,
                            "invoiceAddress.country": args.invoiceCountry,
                            "shippingAddress.street": args.shippingStreet,
                            "shippingAddress.city": args.shippingCity,
                            "shippingAddress.zip": args.shippingZip,
                            "shippingAddress.country": args.shippingCountry
                        }
                    })).then(function () {
                });
                return Promise.resolve(Customers.findOne({"_id": id}));
            }
        }
    })
})


const schema = new GraphQLSchema({
    name: "LIMS Schema",
    query,
    mutation
});

GraphQL.registerSchema('LIMS', schema);