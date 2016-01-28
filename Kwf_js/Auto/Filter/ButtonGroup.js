Ext.define('Kwf.Auto.Filter.ButtonGroup', {
    extend: 'Kwf.Auto.Filter.Abstract',
    requires: [
        'Ext.button.Button'
    ],
    constructor: function(config) {
        this.callParent(arguments);
        this.toggleButtons = new Array();
        for (var i in config.buttons) {
            var cfg = config.buttons[i];
            this.toggleButtons[i] = new Ext.Button({
                icon: cfg.icon,
                text: cfg.text,
                cls: cfg.cls,
                pressed: cfg.pressed,
                tooltip: cfg.tooltip,
                enableToggle: true
            });
            this.toggleButtons[i].on('toggle', function(button, pressed) {
                if (pressed) {
                    for (var g in this.toggleButtons) {
                        if (this.toggleButtons[g] instanceof Ext.Button && this.toggleButtons[g] != button) {
                            this.toggleButtons[g].toggle(false);
                        };
                    }
                    this.fireEvent('filter', this, this.getParams());
                }
            }, this);
            this.toolbarItems.add(this.toggleButtons[i]);
        }
    },
    getParams: function() {
        var params = {};
        var value = '';
        for (var g in this.toggleButtons) {
            if (this.toggleButtons[g].pressed) {
                value = g;
            };
        }
        params['query_'+this.id] = value;
        return params;
    }
});
