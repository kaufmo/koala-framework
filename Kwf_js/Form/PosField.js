Ext.define('Kwf.Form.PosField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.posfield',
    constructor: function(config) {
        this.callParent(arguments);
        this.on('focus', function(o, e) {
            this.selectText();
        }, this)
    }
});
