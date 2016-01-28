Ext.define('Kwf.Welcome', {
    extend: 'Ext.panel.Panel',
    afterRender: function() {
        this.welcomePanel = Ext.panel.Panel.create({
            cls: 'kwf-welcome',
            width: 304,
            loader: {
                url: '/kwf/welcome/content',
                autoLoad: true
            },
            border: false,
            renderTo: this.getEl()
        });
        this.welcomePanel.getLoader().on('load', function() {
            this.welcomePanel.getEl().center();
        }, this);
        this.callParent(arguments);
    },
    onResize: function(w, h) {
        this.callParent(arguments);
        this.welcomePanel.getEl().center();
    }
});
window.Welcome = Kwf.Welcome;
Ext.enableAria = false;
Ext.enableAriaButtons = false;
Ext.enableAriaPanels = false;
