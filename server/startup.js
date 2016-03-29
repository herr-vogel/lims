Meteor.startup(function() {

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

        //Erstellen der Permissions Collection, wo die Componenten und allowed Querries für die dazugehörigen Rollen gespeichert sind

        if(Permissions.find({}).count() === 0) {
            Permissions.insert({
                role: 'user',
                components: [
                    {name: 'Customer'}],
                allowed: []
            });
        }
    }

})