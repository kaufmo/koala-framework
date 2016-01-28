Ext.define('Kwf.Form.Hidden', {
    extend: 'Ext.form.field.Hidden',
    initComponent: function() {
        this.callParent(arguments);
    },
    setValue: function(v) {
        this.callParent(arguments);
        this.fireEvent('changevalue', v);
    }
});
