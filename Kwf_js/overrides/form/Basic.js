Ext.define('Kwf.overrides.form.Basic', {
    override: 'Ext.form.Basic',
    resetDirty: function () {
        this.getFields().each(function (field) {
            field.resetDirty();
        });
    },
    setDefaultValues: function () {
        this.getFields().each(function (field) {
            field.setDefaultValue();
        }, this);
    },
    clearValues: function () {
        this.getFields().each(function (field) {
            if (field.rendered) field.clearValue();
        }, this);
    },

    //override stupid Ext behavior
    //better to ask the individual form fields
    //needed for: Checkbox, ComboBox, SwfUpload, Date...
    getValues: function () {
        var ret = {};
        this.getFields().each(function (field) {
            if (field.getName && field.getName()) {
                ret[field.getName()] = field.getValue();
            }
        }, this);
        return ret;
    }
});