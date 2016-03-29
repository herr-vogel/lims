Meteor.methods({

    getComponents: function() {

        //Diese Methode gibt die erlaubten Componenten dieser Rolle zurück in einem Array
        var userId = this.userId;
        var roles = Roles.getRolesForUser(userId, DEFAULT_GROUP);
        var allowedComponents = [];

        roles.map(function (role) {

            Promise.resolve(Permissions.findOne({role: role})).then(result => {
                result.components.map(function(component){
                    allowedComponents.push(component.name);
                })
            })
        });
        return allowedComponents;
    }

});