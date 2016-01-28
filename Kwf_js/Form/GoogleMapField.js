Ext.define('Kwf.Form.GoogleMapField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.googlemapsfield',
    requires: [
        'Kwf.Form.GoogleMapWindow'
    ],
    readOnly : false,
    width : 200,
    statics: {
        GoogleMapWindow: null
    },
    triggers: {
        onClick: {
            cls: 'x-form-search-trigger',
            handler: function() {
                Kwf.GoogleMap.Loader.load(function () {
                    var win = Kwf.Form.GoogleMapField.GoogleMapWindow; //statische var, nur ein window erstellen??
                    if (!win) {
                        win = new Kwf.Form.GoogleMapWindow({
                            modal: true,
                            title: trlKwf('Select your Position'),
                            width: 535,
                            height: 500,
                            shadow: true,
                            closeAction: 'hide'
                        });
                        Kwf.Form.GoogleMapField.GoogleMapWindow = win;
                    }
                    win.purgeListeners();
                    win.on('confirm', function (win, ch) {
                        this.setValue(win.getMarkerPoint());
                    }, this);
                    win.on('clear', function (win, ch) {
                        this.setValue("");
                    }, this);
                    if (this.allowBlank) {
                        win.setHideClearButton(false);
                    } else {
                        win.setHideClearButton(true);
                    }
                    win.show();
                    win.setMarkerPoint(this.getValue());
                }, this);
            }
        }
    }
});