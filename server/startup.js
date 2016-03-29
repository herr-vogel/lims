Meteor.startup(function() {

    Permissions.remove({})
    //People.remove({});

    if (Meteor.users.find().count() === 0) {

        //Erstellen der Test Usern (User, Admin, Root)
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

    //Erstellen der Permissions Collection, wo die Componenten und allowed Querries für die dazugehörigen Rollen gespeichert sind

    if(Permissions.find({}).count() === 0) {
        console.log("test")
        Permissions.insert({
            role: 'user',
            components: [
                {name: 'Customer'}],
            allowed: [
                {name: 'customers'}
            ]
        });

        Permissions.insert({
            role: 'admin',
            components: [
                {name: 'Admin'}],
            allowed: []
        });
    }

    if(Customers.find({}).count() === 0) {
        Customers.insert({
            name: "Test",
            department: "Departement",
            website: "test.com",
            phone: "000 phone",
            fax: "000 fax",
            invoiceAddress: {
                "street": "Test Strasse",
                "city": "Test City",
                "zip": "Zip",
                "country": "Test Land"
            },
            shippingAddress: {
                "street": "Test Strasse S",
                "city": "Test City S",
                "zip": "Zip S",
                "country": "Test Land S"
            }
        });
        Customers.insert({
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
        })
    }

    if(People.find({}).count() === 0) {
        People.insert({
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
        });
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
    }

})