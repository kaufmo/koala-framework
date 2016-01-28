Ext.define('Kwf.overrides.container.Container', {
    override: 'Ext.container.Container',
    disableRecursive: function() {
        this.disable();
    },
    enableRecursive: function() {
        this.enable();
    }
});