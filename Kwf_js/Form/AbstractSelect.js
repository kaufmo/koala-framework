Ext.define('Kwf.Form.AbstractSelect', {
    extend: 'Ext.form.field.Text',
    requires: [
        'Ext.window.Window'
    ],
    triggers: {
        window: {
            cls: 'x-form-search-trigger',
            handler: function() {
                this._getSelectWin().show();
                this._getSelectWin().items.get(0).selectId(this.value);
            }

        }
    },
    readOnly: true,
    width: 200,
    _windowItem: null,

    // mandatory parameters
    // controllerUrl

    // optional parameters
    // windowWidth, windowHeight
    // displayField

    _getWindowItem: function()
    {
    },

    _getSelectWin: function() {
        if (!this._selectWin) {
            this._selectWin = new Ext.window.Window({
                width: this.windowWidth || 535,
                height: this.windowHeight || 500,
                modal: true,
                closeAction: 'hide',
                title: trlKwf('Please choose'),
                layout: 'fit',
                buttons: [{
                    text: trlKwf('OK'),
                    handler: function() {
                        this.setValue(this._selectWin.value);
                        this._selectWin.hide();
                    },
                    scope: this
                }, {
                    text: trlKwf('Cancel'),
                    handler: function() {
                        this._selectWin.hide();
                    },
                    scope: this
                }],
                items: this._getWindowItem()
            });
        }
        return this._selectWin;
    },

    getValue: function() {
        return this.value;
    },

    setValue: function(value) {
        if (value && typeof value.name != 'undefined') {
            Kwf.Form.AbstractSelect.superclass.setValue.call(this, value.name);
            this.value = value.id;
        } else {
            this.callParent(arguments);
            this.value = value;
        }
        this.fireEvent('changevalue', this.value, this);
    }

});
