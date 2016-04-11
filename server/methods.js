Meteor.methods({

    getComponents: function() {

        // this method returns the components the user is allowed to se
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
        // this method checks if the user is allowed to see the component and returns a boolean
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
        // checks if the component is the allowedComponents array
        var _canShow = (allowedComponents.indexOf(component) >= 0);
        if (!_canShow) {
            console.log('user ', (Meteor.users.findOne({_id: userId})), ' cannot show component: ', component);
        }

        return _canShow;
    }

});