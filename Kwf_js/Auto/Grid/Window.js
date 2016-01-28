Ext.define('Kwf.Auto.Grid.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.kwf.autogridwindow',
    requires: [
        'Kwf.Auto.GridPanel',
        'Ext.Action'
    ],
    layout: 'fit',
    modal: true,
    closeAction: 'hide',
    queryParam: 'id',
    initComponent : function()
    {
        var cfg = Ext.apply({
            controllerUrl: this.controllerUrl,
            autoLoad: false,
            baseParams: this.baseParams
        }, this.autoGridConfig);
        this.autoGrid = new Kwf.Auto.GridPanel(cfg);
        this.items = [this.autoGrid];

        this.callParent(arguments);
    },

    showEdit: function(id, record) {
        var p = {};
        p[this.queryParam] = id;
        this.applyBaseParams(p);
        this.show();
        this.autoGrid.load();
    },

    getAutoGrid : function()
    {
        return this.autoGrid;
    },

    getGrid : function()
    {
        return this.getAutoGrid().getGrid();
    },

    getBaseParams: function()
    {
        return this.getAutoGrid().getBaseParams();
    },
    applyBaseParams: function(p)
    {
        this.getAutoGrid().applyBaseParams(p);
    }
});
