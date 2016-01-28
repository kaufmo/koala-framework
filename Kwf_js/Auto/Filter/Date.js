Ext.define('Kwf.Auto.Filter.Date', {
    extend: 'Kwf.Auto.Filter.Abstract',
    requires: [
        'Ext.form.field.Date'
    ],
    constructor: function (config) {
        this.callParent(arguments);
        this.field = new Ext.form.field.Date({
            width: 80,
            value: config.value || ''
        });
        this.toolbarItems.add(this.field);
        this.field.on('menuhidden', function() {
            this.fireEvent('filter', this, this.getParams(config.paramName));
        }, this);
        this.field.on('render', function() {
            this.field.getEl().on('keypress', function() {
                this.fireEvent('filter', this, this.getParams(config.paramName));
            }, this, {buffer: 500});
        }, this);
    },
    reset: function() {
        this.field.reset();
    },
    getParams: function(paramName) {
        var params = {};
        if (this.field.getValue()) {
            params[paramName] = this.field.getValue().format('Y-m-d');
        } else {
            params[paramName] = null;
        }
        return params;
    }
});
