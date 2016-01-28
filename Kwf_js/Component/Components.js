Ext.define('Kwf.Component.Components', {
    extend: 'Kwf.Auto.SyncTreePanel',
    initComponent : function()
    {
        this.controllerUrl = '/admin/component/components';
        this.callParent(arguments);
    }
});
