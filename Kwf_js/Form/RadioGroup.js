Ext.define('Kwf.Form.RadioGroup', {
    extend: 'Ext.form.RadioGroup',
    initComponent: function() {
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        if (this.value) {
            this.setValue(this.value);
        }
        this.items.each(function(c) {
            c.on('check', function(field, newValue, oldValue) {
                if (field.getValue()) {
                    this.fireEvent('change', this, field.inputValue, 'TODO');
                    this.fireEvent('changevalue', field.inputValue);
                }
            }, this);
        }, this);
    },
    isDirty: function() {
        if(this.disabled || !this.rendered) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },
    getValue: function() {
        if (!this.rendered) {
            return this.value;
        } else {
            var ret = null;
            this.items.each(function(c) {
                if (c.getValue()) {
                    ret = c.inputValue;
                    return false;
                }
            }, this);
            return ret;
        }
    },
    setValue: function(v) {
        if (!this.rendered) {
            this.value = v;
        } else {
            this.items.each(function(c) {
                if (c.inputValue == v) {
                    c.setValue(true);
                } else {
                    c.setValue(false);
                }
            }, this);
        }
        this.fireEvent('changevalue', v);
    }
});
