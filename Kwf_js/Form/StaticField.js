Ext.define('Kwf.Form.StaticField', {
    extend: 'Ext.Component',
    alias: 'widget.staticfield',
    autoEl: {tag: 'div', cls:'kwf-form-static-field'},
    isFormField : true,
    initComponent: function() {
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        this.el.update(this.text);
    },
    getName: function() {
        return null;
    },
    getValue: function() {
        return null;
    },
    clearInvalid: function() {},
    reset: function() {},
    setValue: function() {},
    isDirty: function() { return false; },
    isValid: function() { return true; },
    resetDirty: function() {},
    clearValue: function() {},
    validate: function() { return true; },
    setFormBaseParams: function() { },
    setDefaultValue: function() { }
});
