Ext.define('Kwc.Basic.DownloadTag.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.Kwc.Basic.DownloadTag',
    initComponent: function() {
        this.callParent(arguments);
        this.query('[xtype=kwf.file]')[0].on('uploaded', function(field, value) {
            if (value) {
                this.ownerCt.find('autoFillWithFilename', 'filename').forEach(function (f) {
                    var v = value.uploaded_filename || value.filename;
                    v = v.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe')
                        .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
                        .replace(/[^a-z0-9]/g, '_').replace(/__+/g, '_');
                    f.setValue(v);
                }, this);
                this.ownerCt.find('autoFillWithFilename', 'filenameWithExt').forEach(function (f) {
                    if (f.getValue() == '') {
                        f.setValue(value.filename+'.'+value.extension);
                    }
                }, this);
            }
        }, this);
    }
});
