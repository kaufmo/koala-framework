Ext.define('Kwf.overrides.form.field.Date', {
    override: 'Ext.form.field.Date',
    format: trlKwf('Y-m-d'),
    width: 90,
    initComponent: function () {
        this.callParent(arguments);
        if (!this.menuListeners.oldHide) {
            this.menuListeners.oldHide = this.menuListeners.hide;
            this.menuListeners.hide = function () {
                this.menuListeners.oldHide.call(this);
                this.fireEvent('menuhidden', this);
            };
        }
        this.on('render', function () {
            if (this.hideDatePicker) {
                this.container.down('img').setVisible(false);
            }
        }, this);
    }
});