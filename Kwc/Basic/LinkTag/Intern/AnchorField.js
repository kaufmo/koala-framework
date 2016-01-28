Ext.define('Kwc.Basic.LinkTag.Intern.AnchorField', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.kwc.linktag.intern.anchor',
    afterRender: function() {
        this.callParent(arguments);
        var pageSelect = this.ownerCt.items.items[0];
        pageSelect.on('changevalue', function(target) {
            this.currentTarget = this.ownerCt.items.items[0].getValue();
            this.clearValue();
            delete this.lastQuery;
        }, this);
    },

    getParams : function(q){
        var ret = this.callParent(arguments);
        ret.target = this.currentTarget;
        return ret;
    }
});
