Ext.define('Kwf.Auto.FilterCollection', {
    extend: 'Ext.util.MixedCollection',
    requires: [
        'Kwf.Auto.Filter.Button',
        'Kwf.Auto.Filter.ButtonGroup',
        'Kwf.Auto.Filter.ComboBox',
        'Kwf.Auto.Filter.Date',
        'Kwf.Auto.Filter.DateRange',
        'Kwf.Auto.Filter.Text',
        'Kwf.Auto.Filter.TextColumn'
    ],
    constructor: function(filters, scope) {
        this.callParent(arguments);

        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!Kwf.Auto.Filter[f.type]) {
                throw "Unknown filter.type: "+f.type;
            }
            var type = Kwf.Auto.Filter[f.type];
            delete f.type;
            var filterField = new type(f);
            this.add(i, filterField);
        }
    },
    applyToTbar : function(tbar, limit, offset)
    {
        var limitCount = 0;
        var offsetCount = 0;
        var first = true;

        this.each(function(f) {
            offsetCount += 1;
            if (offset && offsetCount <= offset) return;

            limitCount += 1;
            if (limit && limitCount > limit) return;

            if (f.right) {
                tbar.add('->');
                f.label += ' ';
            } else if(first && tbar.length > 0) {
                tbar.add('-');
            }
            if (first && !f.label) f.label = trlKwf('Filter')+':';
            if (f.label) {
                if (!first) {
                    f.label = ' '+f.label;
                }
                tbar.add(f.label);
            } else {
                if (!first) {
                    tbar.add(' ');
                }
            }
            f.getToolbarItem().each(function(i) {
                tbar.add(i);
            });
            first = false;
        }, this);
    }
});
