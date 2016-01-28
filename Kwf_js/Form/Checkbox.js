Ext.define('Kwf.Form.Checkbox', {
    extend: 'Ext.form.field.Checkbox',
    //required because clicking the fieldLabel wouldn't change the value (it changes twice actually)
    getValue: function() {
        return this.checked;
    }
});
