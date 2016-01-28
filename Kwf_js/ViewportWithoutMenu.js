Ext.define('Kwf.ViewportWithoutMenu', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Ext.state.LocalStorageProvider',
        'Ext.state.Manager',
        'Ext.layout.container.Border',
        'Ext.util.ItemCollection'
    ],
    layout: 'fit',
    mabySubmit: function(cb, options) {
        var ret = true;
        this.items.each(function(i) {
            if (i.mabySubmit && !i.mabySubmit(cb, options)) {
                ret = false;
                return false; //break each
            }
        }, this);
        return ret;
    }

});
