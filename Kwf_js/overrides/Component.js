Ext.define('Kwf.overrides.Component', {
    override: 'Ext.Component',
    requires: [
        'Ext.container.Container'
    ],
    disableRecursive: function() {
        if (this.items && this.items.each) {
            this.items.each(function(i) {
                i.disableRecursive();
            }, this);
        }
        this.callParent(arguments);
    },
    enableRecursive: function() {
        if (this.items && this.items.each) {
            this.items.each(function(i) {
                i.enableRecursive();
            }, this);
        }
        this.callParent(arguments);
    },
    bubble: Ext.container.Container.prototype.bubble
});