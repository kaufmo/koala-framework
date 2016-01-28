Ext.define('Kwf.Form.MultiFields.UpButton', {
    extend: 'Ext.Component',
    // private
    onRender : function(ct, position){
        this.el = ct.createChild({
            tag: 'a',
            html: '<img src="/assets/silkicons/arrow_up.png" />',
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
                    g.item.getEl().insertBefore(p.groups[i-1].item.getEl());
                    p.groups.splice(i-1, 2, p.groups[i], p.groups[i-1]);
                    //wenn reihenfolge geaendert wurde muss feld dirty sein
                    //einfach die anzahl faken
                    p.hiddenCountValue.originalCount = -1;
                    break;
                }
            }
            p.updateButtonsState();
        }, this);
    }
});