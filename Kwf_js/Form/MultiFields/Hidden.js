Ext.define('Kwf.Form.MultiFields.Hidden', {
    extend: 'Ext.form.field.Hidden',
    _initFields: function(cnt) {
        var gp = this.multiFieldsPanel;
        if (cnt < gp.minEntries) cnt = gp.minEntries;
        if (cnt > gp.maxEntries) cnt = gp.maxEntries;
        for (var i = gp.groups.length; i < cnt; i++) {
            gp.addGroup();
        }
        for (var i = gp.groups.length; i > cnt; i--) {
            var g = gp.groups[i-1];
            gp.remove(g.item);
            gp.remove(g.deleteButton);
            gp.remove(g.upButton);
            gp.remove(g.downButton);
            gp.groups.splice(i-1, 1);
        }
    },
    setValue : function(value) {
        var gp = this.multiFieldsPanel;
        if (!value instanceof Array) throw new 'ohje, value ist kein array - wos mochma do?';
        this._initFields(value.length);
        for (var i = 0; i < gp.groups.length; i++) {
            if (value[i]) {
                gp.groups[i].id = value[i].id;
            } else {
                gp.groups[i].id = null;
            }
            this._findFormFields(gp.groups[i].item, function(item) {
                if (value[i]) {
                    for (var j in value[i]) {
                        if (item.name == j) {
                            item.setValue(value[i][j]);
                            return;
                        }
                    }
                }
            });
        }
        gp.updateButtonsState(value);

        this.value = value;
    },
    getValue : function() {
        var ret = [];
        var gp = this.multiFieldsPanel;
        for (var i = 0; i < gp.groups.length; i++) {
            var g = gp.groups[i];
            var row = {};
            row.id = g.id;
            this._findFormFields(g.item, function(item) {
                row[item.name] = item.getValue();
            });
            ret.push(row);
        }
        return ret;
    },
    _findFormFields: function(item, fn, scope) {
        if (item.isFormField) {
            fn.call(scope || this, item);
        }
        if (item.items) {
            item.items.each(function(i) {
                return this._findFormFields(i, fn, scope);
            }, this);
        }
    },
    validate : function() {
        var valid = true;
        var gp = this.multiFieldsPanel;
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                if (!f.validate()) {
                    valid = false;
                }
            }, this);
        }, this);
        return valid;
    },
    resetDirty: function() {
        var gp = this.multiFieldsPanel;
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                f.resetDirty();
            }, this);
        }, this);
        this.originalCount = gp.groups.length;
        this.originalValue = this.value;
    },
    clearValue: function() {
        this.callParent(arguments);
        var gp = this.multiFieldsPanel;
        this._initFields(gp.minEntries);
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                f.clearValue();
            }, this);
        }, this);
        this.originalCount = gp.groups.length;
        this.originalValue = '';
    },
    setDefaultValue: function() {
        var gp = this.multiFieldsPanel;
        this._initFields(gp.minEntries);
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                f.setDefaultValue();
            }, this);
        }, this);
        this.originalCount = gp.groups.length;
        this.originalValue = '';
    },
    isDirty : function() {
        var gp = this.multiFieldsPanel;

        //anz. einträge geändert (felder selbst müssen nicht dirty sein)
        if (this.originalCount != gp.groups.length) return true;

        var dirty = false;
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                if (f.isDirty()) {
                    dirty = true;
                    return false; //each verlassen
                }
            }, this);
        }, this);
        return dirty;
    },

    // private
    initEvents : function(){
        this.originalValue = '';
    },

    clearInvalid: function() {
        var gp = this.multiFieldsPanel;
        gp.groups.each(function(g) {
            this._findFormFields(g.item, function(f) {
                f.clearInvalid();
            }, this);
        }, this);
    }
});
