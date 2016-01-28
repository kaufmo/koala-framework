Ext.define('Kwc.Basic.LinkTag.ComboBox', {
    extend: 'Kwc.Abstract.Cards.ComboBox',
    alias: 'widget.kwc.basic.linktag.combobox',
    setValue: function(v) {
        this.callParent(arguments);
        if (v == 'none') {
            this.el.up('.kwc-basic-linktag-form').down('fieldset.kwc-basic-linktag-seo').dom.style.display = 'none';
        } else {
            this.el.up('.kwc-basic-linktag-form').down('fieldset.kwc-basic-linktag-seo').dom.style.display = '';
        }
    }
});
