Ext.define('Kwf.Form.PageSelect', {
    extend: 'Kwf.Form.AbstractSelect',
    alias: 'widget.pageselect',
    requires: [
        'Kwf.Auto.TreePanel'
    ],
    initComponent: function() {
        this.callParent(arguments);
    },
    _getWindowItem: function()
    {
        if (!this._windowItem) {
            this._windowItem = new Kwf.Auto.TreePanel({
                controllerUrl: this.controllerUrl,
                baseParams: this.baseParams,
                listeners: {
                    click: function(node) {
                        var n = node;
                        var name = '';
                        while (n.parentNode.parentNode) {
                            if (name) name += ' - ';
                            name += n.attributes.text;
                            n = n.parentNode;
                        }
                        this._selectWin.value = {
                            id: node.id,
                            name: name
                        };
                    },
                    scope: this
                }
            });
        }
        return this._windowItem;
    },
    setFormBaseParams: function(params) {
        this.baseParams = params;
        if (this._windowItem) {
            this._windowItem.baseParams = params;
        }
    }
});
