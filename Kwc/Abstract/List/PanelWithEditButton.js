Ext.define('Kwc.Abstract.List.PanelWithEditButton', {
    extend: 'Kwf.Auto.FormPanel',
    alias: 'widget.kwc.listwitheditbutton',
    initComponent: function() {
        this.fireEvent('gotComponentConfigs', this.componentConfigs);

        this.callParent(arguments);
    },

    onSubmitSuccess: function(response, options, result) {
        this.callParent(arguments);
        this.reload();
    }
});
