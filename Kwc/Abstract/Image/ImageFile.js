Ext.define('Kwc.Abstract.Image.ImageFile', {
    extend: 'Kwf.Form.File',
    alias: 'widget.kwc.imagefile',
    _completeValue: null,

    initComponent: function() {
        this.callParent(arguments);
        this.on('uploaded', function(field, value) {
            if (value) {
                var fs = this.ownerCt.ownerCt.items.find(function(i){return i.xtype=='fieldset'});
                if (fs) {
                    fs.find('autoFillWithFilename', 'filename').forEach(function (f) {
                        var v = value.uploaded_filename || value.filename;
                        v = v.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe')
                            .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
                            .replace(/[^a-z0-9]/g, '_').replace(/__+/g, '_');
                        f.setValue(v);
                    }, this);
                }
            }
        }, this);
    },

    afterRender: function() {
        this.callParent(arguments);
        this.deleteButton.setText(trlKwf('delete'));
        this.uploadButton.setText(trlKwf('Upload Image'));
    },

    getImageWidth: function () {
        return this._completeValue.imageWidth;
    },

    getImageHeight: function () {
        return this._completeValue.imageHeight;
    },

    setValue: function (value) {
        this._completeValue = value;
        if (value.uploadId) {
            this.uploadButton.setText(trlKwf('Change Image'));
        } else {
            this.uploadButton.setText(trlKwf('Upload Image'));
        }
        this.callParent(arguments);
    }
});
