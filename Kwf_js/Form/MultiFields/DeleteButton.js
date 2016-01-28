Ext.define('Kwf.Form.MultiFields.DeleteButton', {
    extend: 'Ext.Component',
    // private
    onRender : function(ct, position){
        this.el = ct.createChild({
            tag: 'a',
            html: '<img src="/assets/silkicons/delete.png" />',
            href: '#',
            style: 'float: right; position: relative; z-index: 10; left: -20px; top: 1px;'
        }, position);
        this.el.on('click', function(e) {
            e.stopEvent();
            if (this.disabled) return;
            var p = this.multiFieldsPanel;
            for(var i=0; i < p.groups.length; i++) {
                var g = p.groups[i];
                if (g.item == this.groupItem) {
                    p.remove(g.item);
                    p.groups.splice(i, 1);
                    p.updateLayout();
                    break;
                }
            }
            //workaround für Firefox problem wenn eintrag gelöscht wird verschwindet add-Button
            if(p.addGroupButton) p.addGroupButton.hide();
            if(p.addGroupButton) p.addGroupButton.show.defer(1, p.addGroupButton);
            if(p.addGroupButton) p.updateButtonsState();
        }, this);
    }
});