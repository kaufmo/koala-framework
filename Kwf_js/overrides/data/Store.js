Ext.define('Kwf.overrides.data.Store', {
    override: 'Ext.data.Store',
    load : function(options) {
        if (!options) options = {params: {}};
        if (!options.params) options.params = {};
        //this.paramNames.dir = 'direction'; //hack, weil wir keinen eigenen store haben

        //wenn recordType nicht gesetzt meta-parameter schicken um ihn vom Server zu bekommen
        if(!this.model) {
            options.params.meta = true;
        }
        var ret = this.callParent(arguments);
        options.params.meta = undefined;

        return ret;
    }
});