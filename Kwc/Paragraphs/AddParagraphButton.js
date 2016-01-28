Ext.define('Kwc.Paragraphs.AddParagraphButton', {
    extend: 'Ext.button.Button',
    requires: [
        'Ext.menu.Item',
        'Ext.menu.Menu'
    ],
    text : trlKwf('Add Paragraph'),
    icon : '/assets/kwf/images/paragraphAdd.png',
    cls  : 'x-btn-text-icon',
    initComponent: function() {
        this.menu = new Ext.menu.Menu();
        Kwc.Paragraphs.AddParagraphButton.buildMenu.call(this, this.components, this.menu);

        this.callParent(arguments);
    },
    statics: {
        buildMenu: function(components, addToItem) {
            if (components.length == 0) { return; }
            for (var i in components) {
                if (typeof components[i] == 'string') {
                    addToItem.add(
                        new Ext.menu.Item({
                            component: components[i],
                            text: i,
                            handler: function(menu) {
                                this.fireEvent('addParagraph', menu.component);
                            },
                            icon: this.componentIcons[components[i]],
                            scope: this
                        })
                    );
                } else {
                    var item = new Ext.menu.Item({text: i.replace(/\>\>/, ''), menu: []});
                    addToItem.add(item);
                    Kwc.Paragraphs.AddParagraphButton.buildMenu.call(this, components[i], addToItem.items.items[addToItem.items.length - 1].menu);
                }
            }
        }
    }
});
