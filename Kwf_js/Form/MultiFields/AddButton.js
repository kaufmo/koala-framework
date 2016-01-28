Ext.define('Kwf.Form.MultiFields.AddButton', {
    extend: 'Ext.Component',
    // private
    onRender : function(ct, position){
        this.el = ct.createChild({
            tag: 'a',
            html: '<img src="/assets/silkicons/add.png" />',
            href: '#',
            style: 'float: right; position: relative; z-index: 10; left: -20px; top: 1px;'
        }, position);
        this.el.on('click', function(e) {
            e.stopEvent();
            if (this.disabled) return false;
            var item = this.multiFieldsPanel.addGroup();
            var breakIt = false;
            item.cascade(function(i) {
                if (!breakIt && i.isFormField && i.isVisible()) {
                    i.focus();
                    //return false funktioniert nicht, workaround:
                    breakIt = true;
                }
            }, this);
        }, this);
    }
});