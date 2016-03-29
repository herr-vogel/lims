Meteor.methods({

    getComponents: function() {

        //Diese Methode gibt die erlaubten Komponenten dieser Rolle zurück in einem Array.
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
    },

    canShow: function(component) {
        //Diese Methode überprüft ob der der User die Komponente sehen darf und gibt einen Boolean zurück.
        var userId = this.userId;
        var roles = Roles.getRolesForUser(userId, DEFAULT_GROUP);
        var allowedComponents = [];

        roles.map(function (role) {
            var perm = Permissions.findOne({role: role});
            if(perm.components !== undefined) {
                perm.components.map(function (component) {
                    allowedComponents.push(component.name);
                })
            }


        });
        //Checkt ob die Komponente in dem Array "allowedComponents" enthalten ist
        var _canShow = (allowedComponents.indexOf(component) >= 0);
        if (!_canShow) {
            console.log('user ', (Meteor.users.findOne({_id: userId})), ' cannot show component: ', component);
        }

        return _canShow;
    }

});