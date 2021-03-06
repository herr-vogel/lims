Meteor.startup(function() {

    //Meteor.users.remove({});
    //Permissions.remove({});
    //People.remove({});
    //Customers.remove({});

    if (Meteor.users.find().count() === 0) {

        // insert test Users into Users (user, admin & root)
        var users = [
            {name:"Test User", username:"user",email:"user@user.com", roles:['user']},
            {name:"Test Admin", username:"admin",email:"admin@admin.com", roles:['admin']},
            {name:"Test Root", username:"root",email:"root@root.com", roles:['user','admin']}
        ];

        users.map( function (user) {
            var id;
            id = Accounts.createUser({
                username: user.username,
                email: user.email,
                password: "test",
                profile: { name: user.name }
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles, DEFAULT_GROUP);
            }

            console.log('user: ', user.name," roles: ", Roles.getRolesForUser(id,DEFAULT_GROUP).toString());
        });

    }

    //inset data into Permissions collection

    if(Permissions.find({}).count() === 0) {
        Permissions.insert({
            role: 'user',
            components: [
                {name: 'Customers'}],
            allowed: [
                {name: 'customers'},
                {name: 'insertCustomer'},
                {name: 'customer'},
                {name: 'deleteCustomer'},
                {name: 'updateCustomer'},
                {name: 'people'},
                {name: 'person'},
                {name: 'deletePerson'},
                {name: 'insertPerson'},
                {name: "removeCustomerIdInPerson"},
                {name: 'updatePerson'}
            ]
        });

        Permissions.insert({
            role: 'admin',
            components: [
                {name: 'Admin'}],
            allowed: [
                {name: 'users'},
                {name: 'user'},
                {name: 'deleteUser'},
                {name: 'insertUser'},
                {name: 'updateUser'}
            ]
        });
    }

    // insert sample data into Customers & Persons

    if(Customers.find({}).count() === 0) {
        Customers.insert({
            _id: "2x6EMcMLPtE6nojDt",
            name: "Test",
            department: "Departement",
            website: "test.com",
            phone: "000 phone",
            fax: "000 fax",
            invoiceAddress: {
                "street": "Test Strasse",
                "city": "Test City",
                "zip": "0",
                "country": "Test Land"
            },
            shippingAddress: {
                "street": "Test Strasse S",
                "city": "Test City S",
                "zip": "01",
                "country": "Test Land S"
            }
        });
    }

    if(People.find({}).count() === 0) {
        People.insert({
            salutation: "Herr",
            firstName: "Daniel",
            lastName: "Vogel",
            role: "Intern",
            fax: "Fax",
            phone: "Phone",
            mobile: "Mobile",
            email: "daniel.vogel@m.com",
            customer_id: "2x6EMcMLPtE6nojDt",
            privateAddress: {
                "street": "Buchen",
                "city": "Basel",
                "zip": "4000",
                "country": "Schweiz"
            }
        })
        People.insert({
            salutation: "Herr S",
            firstName: "Daniel S",
            lastName: "Vogel S",
            role: "Intern",
            fax: "Fax",
            phone: "Phone",
            mobile: "Mobile",
            email: "daniel.vogel@m.com",
            privateAddress: {
                "street": "Buchen",
                "city": "Basel",
                "zip": "4000",
                "country": "Schweiz"
            }
        })
    }

})