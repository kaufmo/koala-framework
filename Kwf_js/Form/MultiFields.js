Ext.define('Kwf.Form.MultiFields', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.multifields',
    requires: [
        'Kwf.Form.MultiFields.AddButton',
        'Kwf.Form.MultiFields.DeleteButton',
        'Kwf.Form.MultiFields.DownButton',
        'Kwf.Form.MultiFields.Hidden',
        'Kwf.Form.MultiFields.UpButton'
    ],
    uses: [
        'Kwf.Auto.FormPanel'
    ],
    minEntries: 1,
    position: true,
    allowAdd: true,
    allowDelete: true,
    initComponent : function() {
        this.callParent(arguments);

        this.hiddenCountValue = new Kwf.Form.MultiFields.Hidden({
            name: this.name,
            multiFieldsPanel: this
        });
        this.add(this.hiddenCountValue);

        this.groups = [];
    },

    enableRecursive: function() {
        this.callParent(arguments);
        this.groups.each(function(g) {
            g.item.enableRecursive();
        });
    },

    disableRecursive: function() {
        this.callParent(arguments);
        this.groups.each(function(g) {
            g.item.disableRecursive();
        });
    },

    // private
    onRender : function(ct, position){
        this.callParent(arguments);

        if (!this.maxEntries || !this.minEntries || this.maxEntries != this.minEntries) {
            if (this.allowAdd) {
                this.addGroupButton = new Kwf.Form.MultiFields.AddButton({
                    multiFieldsPanel: this,
                    renderTo: this.body
                }, position);
            }
        }

        for (var i = 0; i < this.minEntries; i++) {
            this.addGroup();
        }
    },

    // private
    addGroup : function()
    {
        var items = [];
        if (!this.maxEntries || !this.minEntries || this.maxEntries != this.minEntries) {
            if (this.allowDelete) {
                var deleteButton = new Kwf.Form.MultiFields.DeleteButton({
                    multiFieldsPanel: this
                });
                items.push(deleteButton);
            }
            if (this.position) {
                var upButton = new Kwf.Form.MultiFields.UpButton({
                    multiFieldsPanel: this
                });
                items.push(upButton);
                var downButton = new Kwf.Form.MultiFields.DownButton({
                    multiFieldsPanel: this
                });
                items.push(downButton);
            }
        }

        this.multiItems.each(function(i) {
            items.push(i);
        });

        var item = this.add({
            layout: 'form',
            border: false,
            items: items
        });
        if (deleteButton) deleteButton.groupItem = item;
        if (upButton) upButton.groupItem = item;
        if (downButton) downButton.groupItem = item;
        this.updateLayout();

        item.cascade(function(i) {
            if (i.title && i.title.match(/\{(\w+)\}/)) {
                i.replaceTitle = i.title;
                if (RegExp.$1 != 0) i.replaceTitleField = RegExp.$1;
            }
            var form = this.findParentBy(function(p) { return (p instanceof Kwf.Auto.FormPanel); });
            if (form && i.setFormBaseParams) {
                i.setFormBaseParams(form.getBaseParams());
            }
        }, this);

        this.hiddenCountValue._findFormFields(item, function(i) {
            i.setDefaultValue();
            i.clearInvalid();
        });

        if (this.multiItems[this.multiItems.length-1].xtype == 'fieldset') {
            if (upButton && upButton.el) {
                upButton.el.applyStyles('clear: right; left: 0;');
            } else if (upButton) {
                upButton.style += ' clear: right; left: 0;';
            }
            if (downButton && downButton.el) {
                downButton.el.applyStyles('clear: right; left: 0;');
            } else if (downButton) {
                downButton.style += ' clear: right; left: 0;';
            }
        }

        //firefox schiebt den button ned nach unten
        if(this.addGroupButton) this.addGroupButton.hide();
        if(this.addGroupButton) this.addGroupButton.show.defer(100, this.addGroupButton);

        if (this.disabled) {
            item.disableRecursive();
        } else {
            item.enableRecursive();
        }

        this.groups.push({
            item: item,
            deleteButton: deleteButton,
            upButton: upButton,
            downButton: downButton
        });

        this.updateButtonsState();

        return item;
    },

    updateButtonsState: function(values) {
        if (this.addGroupButton) {
            if (this.maxEntries && this.groups.length >= this.maxEntries) {
                this.addGroupButton.disable();
            } else {
                this.addGroupButton.enable();
            }
            if (this.multiItems[this.multiItems.length-1].xtype == 'fieldset') {
                if (this.groups.length) {
                    this.addGroupButton.el.setStyle('top', '-19px');
                } else {
                    this.addGroupButton.el.setStyle('top', '0');
                }
            }
        }
        for (var i = 0; i < this.groups.length; i++) {
            var g = this.groups[i];
            if (g.upButton && i == 0) {
                g.upButton.disable();
            } else if (g.upButton) {
                g.upButton.enable();
            }
            if (g.downButton && i == this.groups.length-1) {
                g.downButton.disable();
            } else if (g.downButton) {
                g.downButton.enable();
            }
            if (g.deleteButton && this.minEntries >= this.groups.length) {
                g.deleteButton.disable();
            } else if (g.deleteButton) {
                g.deleteButton.enable();
            }
            g.item.cascade(function(item) {
                if (item.replaceTitle) {
                    var title = item.replaceTitle;
                    title = title.replace(/\{0\}/, i+1);
                    if (item.replaceTitleField) {
                        var exp = /\{\w+\}/;
                        if (values && values[i]) {
                            title = title.replace(exp, values[i][item.replaceTitleField]);
                        } else {
                            title = item.title;
                            if (exp.test(title)) title = trlKwf('New Entry');
                        }
                    }
                    item.setTitle(title);
                }
            }, this);
        }
    }
});
