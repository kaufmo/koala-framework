Ext.define('Kwf.Auto.SyncTreePanel', {
    extend: 'Kwf.Binding.AbstractPanel',
    alias: 'widget.kwf.autotreesync',
    requires: [
        'Ext.Action',
        'Kwf.Connection',
        'Kwf.Auto.FilterCollection',
        'Kwf.Auto.Tree.Panel',
        'Ext.data.TreeStore',
        'Ext.data.TreeModel',
        'Kwf.Auto.Form.Window',
        'Ext.window.MessageBox',
        'Ext.tree.plugin.TreeViewDragDrop'
    ],
    layout: 'fit',

    initComponent : function()
    {
        if (this.autoLoad !== false) {
            this.autoLoad = true;
        } else {
            delete this.autoLoad;
        }

        this.actions['delete'] = new Ext.Action({
            text    : trlKwf('Delete'),
            handler : this.onDelete,
            cls     : 'x-btn-text-icon',
            disabled: true,
            scope   : this
        });
        this.actions.add = new Ext.Action({
            text    : trlKwf('Add'),
            handler : this.onAddRecord,
            cls     : 'x-btn-text-icon',
            scope   : this
        });
        this.actions.edit = new Ext.Action({
            text    : trlKwf('Edit'),
            handler : this.onEdit,
            cls     : 'x-btn-text-icon',
            disabled: true,
            scope   : this
        });
        this.actions.invisible = new Ext.Action({
            text    : trlKwf('Toggle Visibility'),
            handler : this.onVisible,
            cls     : 'x-btn-text-icon',
            disabled: true,
            scope   : this
        });
        this.actions.reload = new Ext.Action({
            text    : '',
            handler : function () { this.reload(); },
            icon    : '/assets/silkicons/arrow_rotate_clockwise.png',
            cls     : 'x-btn-icon',
            tooltip : trlKwf('Reload'),
            scope   : this
        });

        this.callParent(arguments);
        if (this.autoLoad) {
            this.on('render', this.doAutoLoad, this, {delay:10});
        }
    },
    
    doAutoLoad : function()
    {
        //autoLoad kann in der zwischenzeit abgeschaltet werden, zB wenn
        //wir in einem Binding sind
        if (!this.autoLoad) return;
        this.loadMeta();
    },

    loadMeta: function()
    {
        if (!this.metaConn) this.metaConn = new Kwf.Connection({ autoAbort: true });
        this.metaConn.request({
            mask: this.el || Ext.getBody(),
            url: this.controllerUrl + '/json-meta',
            params: this.baseParams,
            success: this.onMetaChange,
            scope: this
        });
    },
    
    reload: function()
    {
        this.tree.un('collapsenode', this.onCollapseNode, this);
        this.tree.un('expandnode', this.onExpandNode, this);
        var node = this.getSelection().length ? this.getSelection()[0] : null;
        if (!node || !node.getOwnerTree()) {
            this.tree.getStore().reload();
        } else {
            this.tree.getStore().reload({
                params: Ext.apply(this.tree.getStore().getProxy().extraParams, {
                    openedId: node.get('id')
                })
            });
        }
    },

    onMetaChange: function(response, options, meta) {
        this.icons = meta.icons;
        for (var i in this.icons) {
            if (i in this.actions) {
                this.actions[i].initialConfig.icon = this.icons[i];
            }
        }

        // Toolbar
        if (meta.buttons.each == undefined) { // Abfrage nötig, falls keine Buttons geliefert
            var tbar = [];
            for (var button in meta.buttons) {
                if (meta.buttons[button]) {
                    tbar.add(this.getAction(button));
                }
            }
            this.filters = new Kwf.Auto.FilterCollection(meta.filters);
            this.filters.each(function(filter) {
                filter.on('filter', function(f, params) {
                    this.applyBaseParams(params);
                    this.reload();
                }, this);
            }, this);
            this.filters.applyToTbar(tbar);
        }
        
        // Tree
        var baseParams = this.baseParams != undefined ? this.baseParams : {};
        if (this.openedId != undefined) { baseParams.openedId = this.openedId; }

        var viewConfig = null;
        if (meta.enableDD) {
            viewConfig = {
                plugins: {
                    ptype: 'treeviewdragdrop',
                    pluginId: 'treeviewdragdrop',
                    containerScroll: true
                }
            };
            if (meta.dropConfig) viewConfig.plugins = Ext.apply(viewConfig.plugins, meta.dropConfig);
        }

        this.tree = new Kwf.Auto.Tree.Panel({
            border: false,
            hideHeaders: true,
//            animate     : true,
            store: new Ext.data.TreeStore({
                defaultRootProperty: 'nodes',
                folderSort: meta.enableDD,
                proxy: {
                    type: 'ajax',
                    reader: 'json',
                    extraParams: baseParams,
                    url: this.controllerUrl + '/json-data'
                }
            }),
            viewConfig  : viewConfig,
            autoScroll  : true,
            rootVisible : meta.rootVisible,
            tbar        : tbar
        });

        this.tree.setRootNode(
            new Ext.data.TreeModel({
                text: meta.rootText,
                id: '0',
                allowDrag: false
            })
        );

        this.tree.getSelectionModel().on('selectionchange', this.onSelectionchange, this);
        this.tree.getSelectionModel().on('beforeselect', function(selModel, newNode, oldNode) {
            return this.fireEvent('beforeselectionchange', newNode.get('id'));
        }, this);
        this.tree.getView().on('beforedrop', this.onMove, this);

        this.tree.on('load', function(store, records, success, operation, node) {
            if (this.openedId == node.id) {
                node.select();
            }
            return true;
        }, this);

        this.tree.getStore().on('load', function(node) {
            this.tree.on('collapsenode', this.onCollapseNode, this);
            this.tree.on('expandnode', this.onExpandNode, this);
        }, this);

        this.relayEvents(this.tree, ['click', 'dblclick']);

        this.add(this.tree);
        this.updateLayout();

        this.tree.getRootNode().expand();
        if (meta.rootVisible) {
            this.tree.getRootNode().set('icon', meta.icons.root);
            this.tree.getRootNode().select();
        }

        if (!this.editDialog && meta.editDialog) {
            this.editDialog = meta.editDialog;
        }
        if (this.editDialog && !(this.editDialog instanceof Kwf.Auto.Form.Window)) {
            this.editDialog = new Kwf.Auto.Form.Window(meta.editDialog);
        }
        if (this.editDialog) {
            this.editDialog.on('datachange', function(o) {
                if (o.data.addedId != undefined) {
                    id = o.data.addedId;
                } else {
                    id = this.tree.getSelectionModel().getSelection().id;
                }
                this.onSave(id);
            }, this);
            this.tree.on('dblclick', function(grid, rowIndex) {
                this.onEdit();
            }, this);
            if (this.editDialog.applyBaseParams) {
                this.editDialog.applyBaseParams(this.getBaseParams());
            }
        }

        this.fireEvent('loaded', this.tree);
    },

    onEdit : function (o, e) {
        var node = this.tree.getSelectionModel().getSelection();
        if (!node.id || node.id === 0 || node.id === '0') return;
        if (this.editDialog != undefined) {
            this.editDialog.showEdit(node.id);
        } else {
            this.fireEvent('editaction', node);
        }
    },

    onAddRecord: function (o, e) {
        if (this.editDialog != undefined) {
            this.editDialog.getAutoForm().applyBaseParams({
                parent_id: this.getSelectedId()
            });
            this.editDialog.showAdd();
        } else {
            this.fireEvent('addaction', this.tree.getSelectionModel().getSelection());
        }
    },

    onSave : function (id)
    {
        Ext.Ajax.request({
            url: this.controllerUrl + '/json-node-data',
            mask: this.body,
            params: Ext.apply({node:id}, this.getBaseParams()),
            success: function(response, options, result) {
                this.onSaved(result.data);
            },
            scope: this
        });
    },

    onSelectionchange: function (selModel, node) {
        if (node && node.id != 0) {
            this.getAction('edit').enable();
            this.getAction('invisible').enable();
            this.getAction('delete').enable();
        } else {
            this.getAction('edit').disable();
            this.getAction('invisible').disable();
            this.getAction('delete').disable();
        }
        this.fireEvent('selectionchange', node);
    },

    onDelete: function (o, e) {
        Ext.MessageBox.confirm(trlKwf('Delete'), trlKwf('Do you really want to delete this entry:\n\n"') + this.tree.getSelectionModel().getSelection().text + '"',
            function  (button) {
                if (button == 'yes') {
                    Ext.Ajax.request({
                        url: this.controllerUrl + '/json-delete',
                        mask: this.body,
                        params: Ext.apply({id:this.getSelectedId()}, this.getBaseParams()),
                        success: function(response, options, result) {
                            this.onDeleted(result);
                        },
                        scope: this
                    });
                }
            },
            this
        );
    },

    onMove : function(node, data, overModel, dropPosition, dropHandlers) {
        var params = this.getBaseParams();
        params.source = data.records[0].get('id');
        params.target = overModel.get('id');
        params.point = dropPosition;
        Ext.Ajax.request({
            url: this.controllerUrl + '/json-move',
            mask: this.body,
            params: params,
            success: function(response, options, result) {
                this.onMoved(result);
            },
            failure: function(r) {
                this.tree.getRootNode().reload();
            },
            scope: this
        });
        //dropEvent.dropStatus = true;
        //dropEvent.cancel = true;
        return true;
    },

    onCollapseNode : function(node) {
        debugger;
        if (!node.attributes.filter) {
            Ext.Ajax.request({
                url: this.controllerUrl + '/json-collapse',
                params: Ext.apply({id:node.id}, this.getBaseParams())
            });
        }
    },

    onExpandNode : function(node) {
        debugger;
        if (node.attributes.children && node.attributes.children.length > 0 && !node.attributes.filter) {
            Ext.Ajax.request({
                url: this.controllerUrl + '/json-expand',
                params: Ext.apply({id:node.id}, this.getBaseParams())
            });
        }
    },

    onVisible : function (o, e) {
        Ext.Ajax.request({
            url: this.controllerUrl + '/json-visible',
            mask: this.body,
            params: Ext.apply({id:this.getSelectedId()}, this.getBaseParams()),
            success: function(response, options, result) {
                node = this.getTree().getStore().getNodeById(result.id);
                node.set('visible', result.visible);
                node.set('icon', result.icon);
            },
            scope: this
        });
    },

    getTree : function() {
        return this.tree;
    },
    getSelectionModel : function() {
        if (!this.getTree()) return null;
        return this.getTree().getSelectionModel();
    },
    getSelection : function() {
        if (!this.getSelectionModel()) return null;
        return this.getSelectionModel().getSelection();
    },

    //für AbstractPanel
    getSelectedId: function() {
        var s = this.getSelection();
        if (s && s.length) return s[0].get('id');
        return null;
    },

    //für AbstractPanel
    selectId: function(id) {
        if (id) {
            if (this.getTree()) {
                var n = this.getTree().getNodeById(id);
                if (n) {
                    n.select();
                }
            } else {
                this.openedId = id;
            }
        } else {
            var m = this.getSelectionModel();
            if (m) m.clearSelections();
        }
    },

    onMoved : function (response)
    {
        var parent;
        if (!response.parent) {
            parent = this.tree.getRootNode();
        } else {
            parent = this.getTree().getStore().getNodeById(response.parent);
        }
        var node = this.getTree().getStore().getNodeById(response.node);
        var before = this.getTree().getStore().getNodeById(response.before);
        parent.insertBefore(node, before);
        parent.expand();
    },

    onSaved : function (response)
    {
        this.tree.getRootNode().reload();
    },

    onDeleted: function (response) {
        this.tree.getRootNode().reload();
    },

    setBaseParams : function(baseParams) {
        this.callParent(arguments);
        if (this.editDialog && this.editDialog.setBaseParams) {
            this.editDialog.setBaseParams(baseParams);
        }
    },
    applyBaseParams : function(baseParams) {
        this.callParent(arguments);
        if (this.editDialog && this.editDialog.applyBaseParams) {
            this.editDialog.applyBaseParams(baseParams);
        }
    }

});
