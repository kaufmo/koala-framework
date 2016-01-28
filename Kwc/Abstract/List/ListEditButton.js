Ext.define('Kwc.Abstract.List.ListEditButton', {
    extend: 'Kwf.Auto.GridPanel',
    alias: 'widget.kwc.list.listEditButton',
    initComponent: function() {
        this.callParent(arguments);

        this.on('cellclick', function(grid, rowIndex, columnIndex, e) {
            var col = grid.getColumnModel().config[columnIndex];
            if (col.columnType != 'editContent') return;
            var row = grid.getStore().getAt(rowIndex);
            if (!row.data.id) return;

            var componentId = col.editIdTemplate.replace('{0}', row.data.id);
            componentId = componentId.replace('{componentId}', this.getBaseParams().componentId);
            this.fireEvent('editcomponent', {
                componentClass: col.editComponentClass,
                type: col.editType,
                componentIdSuffix: col.editComponentIdSuffix,
                editComponents: this.contentEditComponents,
                componentId: componentId
            });

        }, this);

        this.fireEvent('gotComponentConfigs', this.componentConfigs);
    }
});
