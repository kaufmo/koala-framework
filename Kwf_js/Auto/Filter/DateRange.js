Ext.define('Kwf.Auto.Filter.DateRange', {
    extend: 'Kwf.Auto.Filter.Abstract',
    requires: [
        'Ext.form.field.Date',
        'Ext.button.Button'
    ],
    constructor: function (config) {
        this.callParent(arguments);

        this.fieldFrom = new Ext.form.field.Date({
            width: 80,
            value: config.from
        });


        this.toolbarItems.add(this.fieldFrom);
        this.toolbarItems.add(' - ');
        this.fieldTo = new Ext.form.field.Date({
            width: 80,
            value: config.to
        });
        this.toolbarItems.add(this.fieldTo);

        this.paramName = config.paramName;

        if (config.button) {
            this.toolbarItems.add(new Ext.Button({
                text: trlKwf('Search'),
                handler: function() {
                    this.fireEvent('filter', this, this.getParams());
                },
                scope: this
            }));
        }

        this.fieldTo.on('menuhidden', reload, this);

        if (!config.button) {
            this.fieldTo.on('render', function() {
                this.fieldTo.getEl().on('keypress',reload, this, {buffer: 500});
            }, this);

            this.fieldFrom.on('menuhidden', reload , this);
            this.fieldFrom.on('render', function() {
                this.fieldFrom.getEl().on('keypress', reload, this, {buffer: 500});
            }, this);
        }

        function reload(){
            if (this.fieldFrom.isValid() && this.fieldTo.isValid()) {
                this.fireEvent('filter', this, this.getParams());
            }
        }
    },
    reset: function() {
        this.fieldFrom.reset();
        this.fieldTo.reset();
    },
    getParams: function() {
        var params = {};
        if (this.fieldFrom.getValue()) {
            params[this.paramName+'_from'] = this.fieldFrom.getValue().format('Y-m-d');
        } else {
            params[this.paramName+'_from'] = null;
        }
        if (this.fieldTo.getValue()) {
            params[this.paramName+'_to'] = this.fieldTo.getValue().format('Y-m-d');
        } else {
            params[this.paramName+'_to'] = null;
        }
        return params;
    }
});
