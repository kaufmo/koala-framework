Ext.define('Kwf.About', {
    extend: 'Ext.window.Window',
    initComponent: function() {
        this.title = 'About';
        this.width = 350;
        this.height = 200;
        this.resizable = false;
        this.layout = 'fit';
        this.modal = true;
        this.items = [new Ext.panel.Panel({
            cls: 'kwf-about',
            autoLoad: '/kwf/user/about/content'
        })];
        this.callParent(arguments);
    }
});
