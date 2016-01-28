Ext.define('Kwc.Columns.Abstract.List', {
    extend: 'Kwc.Abstract.List.List',
    alias: 'widget.kwc.columns.list',
    initComponent: function()
    {
        this.callParent(arguments);
        var deleteAction = this.grid.getAction('delete');
        deleteAction.disable();
        deleteAction.initialConfig.needsSelection = false;
        this.grid.on('selectionchange', function(selModel) {
            if (selModel.getSelected()) {
                if (this.grid.store.totalLength <= selModel.getSelected().get('total_columns')) {
                    deleteAction.disable();
                } else {
                    deleteAction.enable();
                }
            }
        }, this);
    }
});
