Ext.define('Kwf.Enquiries.ViewPanel', {
    extend: 'Kwf.Binding.AbstractPanel',
    initComponent: function()
    {
        this.callParent(arguments);
    },

    load: function(params, options) {
        this.getLoader().load({
            url: this.controllerUrl+'/get-enquiry',
            params: { id: this.getBaseParams().id }
        });
    }
});
