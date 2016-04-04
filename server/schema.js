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
        },
        customer: {
            type: Customer,
            args: {
                id: {type: GraphQLString}
            },
            resolve (rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                return Promise.resolve(Customers.findOne({"_id": args.id}));
            }
        },
        people: {
            type: new GraphQLList(Person),
            args: {
                limit: {type: GraphQLInt}
            },
            resolve(rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );

                let fields = {};
                let fieldASTs = info.fieldASTs;
                fieldASTs[0].selectionSet.selections.map(function (selection) {
                    fields[selection.name.value] = 1;
                });

                return Promise.resolve(Meteor.wrapAsync(People.rawCollection().aggregate.bind(People.rawCollection()))([
                    {
                        $lookup:
                        {
                            from: "customers",
                            localField: "customer_id",
                            foreignField: "_id",
                            as: "customer"
                        }
                    },
                    {
                        $unwind: {
                            path: "$customer",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]));
            }
        },
        person: {
            type: Person,
            args: {
                id: {type: GraphQLString}
            },
            resolve (rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                return Promise.resolve(People.findOne({"_id": args.id}));
            }
        },
        users: {
            type: new GraphQLList(User),
            args: {
                limit: {type: GraphQLInt}
            },
            resolve(rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                return Promise.resolve(Meteor.users.find({}, {limit: args.limit}).fetch());
            }
        },
        user: {
            type: User,
            args: {
                id: {type: GraphQLString}
            },
            resolve(rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                return Promise.resolve(Meteor.users.findOne({"_id": args.id}))
            }
        },
        permissions: {
            type: new GraphQLList(Permission),
            args: {
                role: {type: GraphQLString}
            },
            resolve (rootValue, args, info) {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                return Promise.resolve(Permissions.find({}).fetch());
            }
        }


    })
});

const mutation = new GraphQLObjectType({
    name: 'LIMSMutations',
    fields: () => ({
        //customer mutations
        insertCustomer: {
            type: Customer,
            args: {
                name: {type: GraphQLString},
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

                var myPromise = new Promise(function (resolve) {
                    var insertedCustomer = Customers.insert({
                        "name": args.name,
                        "customer_code": args.customerCode,
                        "department": args.department,
                        "website": args.website,
                        "phone": args.phone,
                        "fax": args.fax,
                        "invoiceAddress": {
                            "street": args.invoiceStreet,
                            "city": args.invoiceCity,
                            "zip": args.invoiceZip,
                            "country": args.invoiceCountry
                        },
                        "shippingAddress": {
                            "street": args.shippingStreet,
                            "city": args.shippingCity,
                            "zip": args.shippingZip,
                            "country": args.shippingCountry
                        }
                    }, function (err, docsInserted) {

                        if (err) {
                            resolve(err)
                        }
                        else {
                            resolve(Customers.findOne({"_id": docsInserted}));
                        }


                    })
                })
                return myPromise

            }
        },
        deleteCustomer: {
            type: Customer,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                var myPromise = new Promise(function (resolve) {
                    var deletetdCustomer = Customers.remove({"_id": args.id}, function (err, result) {
                        if (err) {
                            resolve(err);
                        }
                        else {
                            resolve(result);
                        }
                    })
                });
                return myPromise;
            }
        },
        updateCustomer: {
            type: Customer,
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
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
                    }))
                return Promise.resolve(Customers.findOne({"_id": id}));
            }
        },
        //person mutations
        deletePerson: {
            type: Customer,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                var myPromise = new Promise(function (resolve) {
                    var deletetdPerson = People.remove({"_id": args.id}, function (err, result) {
                        if (err) {
                            resolve(err);
                        }
                        else {
                            resolve(result);
                        }
                    })
                });
                return myPromise;
            }
        },
        insertPerson: {
            type: Person,
            args: {
                salutation: {type: GraphQLString},
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                role: {type: GraphQLString},
                fax: {type: GraphQLString},
                phone: {type: GraphQLString},
                mobile: {type: GraphQLString},
                email: {type: GraphQLString},
                privateStreet: {type: GraphQLString},
                privateZip: {type: GraphQLString},
                privateCity: {type: GraphQLString},
                privateCountry: {type: GraphQLString},
                customerId: {type: GraphQLString}

            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                var myPromise = new Promise(function (resolve) {
                    var insertedPerson = People.insert({
                        "salutation": args.salutation,
                        "firstName": args.firstName,
                        "lastName": args.lastName,
                        "role": args.role,
                        "phone": args.phone,
                        "mobile": args.mobile,
                        "fax": args.fax,
                        "email": args.email,
                        "customer_id": args.customerId,
                        "privateAddress": {
                            "street": args.privateStreet,
                            "city": args.privateCity,
                            "zip": args.privateZip,
                            "country": args.privateCountry
                        }

                    }, function (err, docsInserted) {
                        if (err) {
                            resolve(err)
                        }
                        else {
                            resolve(People.findOne({"_id": docsInserted}));
                        }
                    })
                });
                return myPromise;


            }
        },
        updatePerson: {
            type: Person,
            args: {
                id: {type: GraphQLString},
                salutation: {type: GraphQLString},
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                role: {type: GraphQLString},
                fax: {type: GraphQLString},
                phone: {type: GraphQLString},
                mobile: {type: GraphQLString},
                email: {type: GraphQLString},
                privateStreet: {type: GraphQLString},
                privateZip: {type: GraphQLString},
                privateCity: {type: GraphQLString},
                privateCountry: {type: GraphQLString},
                customerId: {type: GraphQLString}

            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                let id = args.id;
                Promise.resolve(People.update({"_id": args.id},
                    {
                        $set: {
                            "salutation": args.salutation,
                            "firstName": args.firstName,
                            "lastName": args.lastName,
                            "role": args.role,
                            "phone": args.phone,
                            "mobile": args.mobile,
                            "fax": args.fax,
                            "email": args.email,
                            "customer_id": args.customerId,
                            "privateAddress.street": args.privateStreet,
                            "privateAddress.city": args.privateCity,
                            "privateAddress.zip": args.privateZip,
                            "privateAddress.country": args.privateCountry

                        }
                    })).then(function () {

                });
                return Promise.resolve(People.findOne({"_id": id}));
            }
        },
        removeCustomerIdInPerson: {
            type: Person,
            args: {
                personId: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                var personId = args.personId;
                Promise.resolve(People.update({"_id": args.personId}, {$set: {"customer_id": ""}})).then(function () {

                });

                return Promise.resolve(People.findOne({"_id": personId}));
            }
        },
        deleteUser: {
            type: User,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );
                var roles = Roles.getRolesForUser(args.id, DEFAULT_GROUP);
                var userId = rootValue.userId;

                if(_.isEqual(roles, ["admin"])) {
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot delete an Admin')
                    )
                }
                if(userId === args.id) {
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot delete himself')
                    )
                }
                Promise.resolve(Meteor.users.remove({_id: args.id}));

                return Promise.resolve(Meteor.users.find({}).fetch());
            }
        },
        insertUser: {
            type: User,
            args: {
                name: {type: GraphQLString},
                username: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString},
                roles: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );

                var myPromise = new Promise(function (resolve, reject) {
                    if (args.roles === "") {
                        reject(
                            new Meteor.Error("Please select a role")
                        )
                    } else {
                        var id = Accounts.createUser({
                            username: args.username,
                            email: args.email,
                            password: args.password,
                            profile: { name: args.name}
                        });

                        if (args.roles != ""){
                            var rolesArray = args.roles.split(",");
                        }

                        console.log(rolesArray)

                        if (id != undefined) {
                            if(rolesArray != undefined) {
                                Roles.addUsersToRoles(id, rolesArray, DEFAULT_GROUP);
                            }
                            resolve(Meteor.users.findOne({"_id": id}));
                        }
                    }



                });

                return myPromise;
            }
        },
        updateUser: {
            type: User,
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
                username: {type: GraphQLString},
                email: {type: GraphQLString},
                roles: {type: GraphQLString}
            },
            resolve: (rootValue, args, info) => {
                if (!canExecute(rootValue, args, info))
                    return Promise.reject(
                        new Meteor.Error((Meteor.users.findOne({_id: rootValue.userId})).profile.name + ' cannot execute '
                            + info.operation.operation + ': ' + info.fieldName)
                    );

                var myPromise = new Promise(function (resolve, reject) {
                    if (args.roles === "") {
                        reject(
                            new Meteor.Error("Please select a role")
                        )
                    }
                    var id = Meteor.users.update(args.id, {$set: {
                        username: args.username,
                        email: args.email,
                        profile: { name: args.name }
                    }});

                    if (args.roles != ""){
                        var rolesArray = args.roles.split(",");
                    }

                    if(id > 0) {
                        if(rolesArray != undefined) {
                            Roles.setUserRoles(args.id, rolesArray, DEFAULT_GROUP);
                        }
                        resolve(Meteor.users.findOne({"_id": args.id}));
                    }

                })

                return myPromise;
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