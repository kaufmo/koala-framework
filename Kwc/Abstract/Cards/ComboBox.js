Ext.define('Kwc.Abstract.Cards.ComboBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.kwc.abstract.cards.combobox',
    uses: [
        'Kwf.Auto.FormPanel'
    ],
    setValue: function(v) {
        this.callParent(arguments);
    },

    doQuery : function(q, forceAll){
        var form = this.findParentBy(function(p) { return (p instanceof Kwf.Auto.FormPanel); });
        this.store.getProxy().extraParams.id = form.getBaseParams().id;
        this.store.getProxy().extraParams.parent_id = form.getBaseParams().parent_id;
        delete this.lastQuery;
        return this.callParent(arguments);
    }
});
