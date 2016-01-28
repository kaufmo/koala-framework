Ext.define('Kwf.overrides.panel.Panel', {
    override: 'Ext.panel.Panel',
    mabySubmit: function(cb, options) {
        var ret = true;
        if (this.items) {
            this.items.each(function(i) {
                if (i.mabySubmit && !i.mabySubmit(cb, options)) {
                    ret = false;
                    return true;
                }
            }, this);
        }
        return ret;
    },
    setAutoScroll: function() {
        if (this.rendered && this.autoScroll) {
            var el = this.body || this.el;
            if (el) {
                el.setOverflow('auto');
                // Following line required to fix autoScroll
                el.dom.style.position = 'relative';
            }
        }
    }
});