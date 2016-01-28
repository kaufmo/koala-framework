Ext.define('Kwf.Auto.Filter.Abstract', {
    extend: 'Ext.mixin.Observable',
    constructor: function(config) {
        this.callParent(arguments);
        this.toolbarItems = [];
        this.id = config.name;
        this.label = config.label || null;
    },
    reset: function() {
    },
    getParams: function() {
        return {};
    },
    getToolbarItem: function() {
        return this.toolbarItems;
    }
});
