Ext.define('Kwf.Enquiries.Index', {
    extend: 'Kwf.Auto.GridPanel',
    alias: 'widget.kwf.enquiries.index',
    requires: [
        'Kwf.Enquiries.ViewPanel'
    ],
    initComponent: function() {
        // Edit form
        var panel = new Kwf.Enquiries.ViewPanel({
            controllerUrl: this.controllerUrl,
            title: trlKwf('Enquiry'),
            region: 'center'
        });

        // main grid
        this.grid = new Kwf.Auto.GridPanel({
            controllerUrl: this.controllerUrl,
            title: trlKwf('Enquiries'),
            region: 'west',
            width: 550,
            split: true,
            bindings: [ panel ]
        });

        this.layout = 'border';
        this.items = [ this.grid, panel ];

        this.callParent(arguments);
    }
});
