Ext.define('Kwf.overrides.dom.Element', {
    override: 'Ext.dom.Element',
    contains: function(el) {
        try {
            return !el ? false : this.isAncestor(el.dom ? el.dom : el);
        } catch(e) {
            return false;
        }
    }
});