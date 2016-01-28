Ext.define('Kwf.Redirects.Index', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Kwf.Form.Cards',
        'Kwf.Form.PageSelect',
        'Kwf.Auto.GridPanel',
        'Kwf.Auto.FormPanel'
    ],
    initComponent: function() {
        var form = new Kwf.Auto.FormPanel({
            controllerUrl: '/kwf/redirects/redirect',
            region: 'center'
        });
        var grid = new Kwf.Auto.GridPanel({
            controllerUrl: '/kwf/redirects/redirects',
            region: 'west',
            split: true,
            width: 550,
            bindings: [ form ]
        });

        this.layout = 'border';
        this.items = [ grid, form ];

        this.callParent(arguments);
    }
});
