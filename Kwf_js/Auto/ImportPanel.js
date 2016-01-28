Ext.define('Kwf.Auto.ImportPanel', {
    extend: 'Kwf.Auto.FormPanel',
    alias: 'widget.kwf.import',
    requires: [
        'Ext.window.MessageBox'
    ],
    initComponent : function()
    {
        this.callParent(arguments);
        this.on('datachange', function(r) {
            this.onAddRecord();
            var msg = trlKwf('The File has been imported successfully.');
            if (r.message) msg = r.message;
            Ext.MessageBox.show({
                title    : trlKwf('Import done'),
                msg      : msg,
                width    : 400,
                buttons  : Ext.MessageBox.OK
            });
        }, this);
    }
});
