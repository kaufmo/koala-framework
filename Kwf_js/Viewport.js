Ext.define('Kwf.Viewport', {
    extend: 'Kwf.ViewportWithoutMenu',
    requires: [
        'Kwf.Menu.Index'
    ],
    initComponent: function()
    {
        Kwf.menu = Ext.ComponentMgr.create({
            xtype: 'kwf.menu',
            region: 'north',
            height: 44,
            border: false
        });
        this.items.push(Kwf.menu);
        this.layout = 'border';
        this.callParent(arguments);
    }
});
