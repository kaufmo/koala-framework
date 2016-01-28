Ext.define('Kwf.Form.Cards', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.kwf.cards',
    afterRender: function() {
        this.callParent(arguments);

        var combobox = this.items.first();

        combobox.on('changevalue', function(value) {
            if (!this.disabled) this.changeValue(value);
        }, this);
    },

    enableRecursive: function() {
        this.enable();
        this.items.each(function(i) {
            i.enable();
        }, this);
        this.changeValue(this.items.first().getValue());
    },
    
    changeValue: function(value)
    {
        var cards = this.items.get(1);
        cards.items.each(function(i) {
            if (i.name != value) {
                i.hide(); //bugfix kitepowerbuchung muss es ganz verschwinden, nicht nur ausgrauen
                i.disableRecursive();
            } else {
                cards.getLayout().setActiveItem(i);
                i.show(); //bugfix für falsche anzeige bei kitepowerbuchung
                i.enableRecursive();
            }
        }, this);
    }

});
