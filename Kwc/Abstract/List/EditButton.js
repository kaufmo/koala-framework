Ext.define('Kwc.Abstract.List.EditButton', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.kwc.listeditbutton',
    requires: [
        'Ext.button.Button'
    ],
    uses: [
        'Kwc.Abstract.List.PanelWithEditButton'
    ],
    //bodyStyle: 'margin-left: 110px',
    defaultAutoCreate : {tag: "input", type: "hidden"},

    initComponent: function()
    {
        if (!this.editButtonText) this.editButtonText = trlKwf('Edit');

        this.callParent(arguments);
    },

    afterRender: function() {
        this.callParent(arguments);
        this.button = new Ext.Button({
            text: this.editButtonText,
            renderTo: this.el.parent(),
            icon: '/assets/silkicons/page_white_edit.png',
            cls: 'x-btn-text-icon',
            scope: this,
            enabled: false,
            handler: function() {
                this.bubble(function(i) {
                    if (i instanceof Kwc.Abstract.List.PanelWithEditButton) {
                        var data = Kwf.clone(i.editComponents[0]);
                        data.componentId = i.getBaseParams().componentId + '-' + this.value;
                        data.editComponents = i.editComponents;
                        i.fireEvent('editcomponent', data);
                        return false;
                    }
                }, this);
            }
        });
    },

    setValue: function(v) {
        this.callParent(arguments);
        this.button.setDisabled(!v);
    }
});
