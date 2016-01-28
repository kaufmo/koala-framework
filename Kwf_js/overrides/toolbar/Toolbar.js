Ext.define('Kwf.overrides.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Spacer'
    ],
    insertItem: function(index, item) {
        //var td = document.createElement("td");
        ////this.tr.insertBefore(td, this.tr.childNodes[index]);
        //this.initMenuTracking(item);
        //item.render(td);
        this.items.insert(index, item);
        return item;
    },
    insert : function(index){
        var a = arguments, l = a.length;
        for(var i = 1; i < l; i++){
            var idx = index+i-1;
            var el = a[i];
            if(el.isFormField){ // some kind of form field
                return this.insertField(idx, el);
            }else if(el.render){ // some kind of Toolbar.Item
                return this.insertItem(idx, el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    return this.insertSeparator(idx);
                }else if(el == " "){
                    return this.insertSpacer(idx);
                }else if(el == "->"){
                    return this.insertFill(idx);
                }else{
                    return this.insertText(idx, el);
                }
            }else if(el.tagName){ // element
                return this.insertElement(idx, el);
            }else if(typeof el == "object"){ // must be button config?
                if(el.xtype){
                    return this.insertField(idx, Ext.create(el));
                }else{
                    return this.insertItem(idx, el);
                }
            }
        }
    },
    insertText : function(index, text){
        return this.insertItem(index, new Ext.toolbar.TextItem({
            html: text
        }));
    },
    insertElement : function(index, el){
        return this.insertItem(index, new Ext.toolbar.Item(el));
    },
    insertFill : function(index){
        return this.insertItem(index, new Ext.toolbar.Fill());
    },
    insertSeparator : function(index){
        return this.insertItem(index, new Ext.toolbar.Separator());
    },
    insertSpacer : function(index){
        return this.insertItem(index, new Ext.toolbar.Spacer());
    },
    insertDom : function(index, config){
        var td = document.createElement("td");
        this.tr.insertBefore(td, this.tr.childNodes[index]);
        Ext.DomHelper.overwrite(td, config);
        var ti = new Ext.toolbar.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },
    insertField : function(index, field){
        //var td = document.createElement("td");
        //this.tr.insertBefore(td, this.tr.childNodes[index]);
        //field.render(td);
        //var ti = new Ext.toolbar.Item(field);
        //ti.render(td);
        this.items.add(field);
        return field;
    }
});