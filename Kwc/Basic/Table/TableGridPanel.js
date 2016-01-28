Ext.define('Kwc.Basic.Table.TableGridPanel', {
    extend: 'Kwf.Auto.GridPanel',
    alias: 'widget.kwc.tablegridpanel',
    requires: [
        'Ext.selection.CheckboxModel'
    ],
    initComponent : function()
    {
        this.gridConfig = { selModel: new Ext.selection.CheckboxModel() };
        this.callParent(arguments);
    }
});