Ext.define('Kwf.Main', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.state.LocalStorageProvider',
        'Ext.state.Manager',
        'Kwf.Viewport',
        'Ext.layout.container.Border',
        'Ext.util.ItemCollection'
    ],
    constructor: function(config) {
        this.callParent(arguments);
    }
});
