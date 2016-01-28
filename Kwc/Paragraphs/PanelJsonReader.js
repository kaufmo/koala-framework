Ext.define('Kwc.Paragraphs.PanelJsonReader', {
    extend: 'Ext.data.reader.Json',
    readRecords: function(o) {
        var ret = this.callParent(arguments);
        if (o.componentConfigs) {
            this.paragraphsPanel.fireEvent('gotComponentConfigs', o.componentConfigs);
            Ext.applyIf(this.paragraphsPanel.dataView.componentConfigs, o.componentConfigs);
        }
        if (o.contentWidth) {
            this.paragraphsPanel.dataView.setWidth(o.contentWidth + 20);
        }
        return ret;
    }
});