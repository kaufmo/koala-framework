Ext.define('Kwc.Abstract.List.List', {
    extend: 'Kwf.Binding.ProxyPanel',
    alias: 'widget.kwc.list.list',
    requires: [
        'Ext.Action',
        'Kwf.Auto.GridPanel',
        'Ext.tab.Panel',
        'Kwf.Utils.MultiFileUploadPanel'
    ],
    uses: [
        'Kwf.Binding.AbstractPanel'
    ],
    listWidth: 300,
    showCopyPaste: true,

    initComponent: function()
    {
        this.layout = 'border';

        this.actions.copy = new Ext.Action({
            text    : trlKwf('Copy'),
            icon: '/assets/silkicons/page_white_copy.png',
            //cls     : 'x2-btn-text-icon',
            handler : this.onCopy,
            disabled: true,
            scope   : this
        });
        this.actions.paste = new Ext.Action({
            text    : trlKwf('Paste'),
            icon: '/assets/silkicons/page_white_copy.png',
            //cls     : 'x2-btn-text-icon',
            handler : this.onPaste,
            scope   : this
        });

        var gridConfig = {
            controllerUrl: this.controllerUrl,
            region: 'center',
            baseParams: this.baseParams, //Kompatibilität zu ComponentPanel
            autoLoad: this.autoLoad,
            listeners: {
                beforerendergrid: function(grid) {
                    var tb = grid.getDockedItems('toolbar[dock="top"]')[0];
                    if (tb && this.showCopyPaste) {
                        tb.add({
                            cls: 'x-btn-icon',
                            icon: '/assets/silkicons/page_white_copy.png',
                            menu: [
                               this.actions.copy,
                               this.actions.paste
                            ]
                        });
                    }
                },
                selectionchange: function() {
                    if (this.grid.getSelected()) {
                        this.actions.copy.enable();
                    } else {
                        this.actions.copy.disable();
                    }
                },
                scope: this
            }
        };
        if (this.useInsertAdd) {
            gridConfig.onAddClick = this.onAddClick.createDelegate(this); // wg. Scope
        }

        this.grid = new Kwf.Auto.GridPanel(gridConfig);
        this.proxyItem = this.grid;

        if (!this.editForms) this.editForms = [];

        // Wenn ein Panel direkt, sonst Tabs
        this.editPanels = [];
        if (this.editForms.length==0 && this.contentEditComponents.length == 1) {
            this.editPanels.push(Kwf.Binding.AbstractPanel.createFormOrComponentPanel(
                this.componentConfigs, this.contentEditComponents[0],
                {region: 'center', title: null}, this.grid
            ));
            this.childPanel = this.editPanels[0];
        } else {
            this.editForms.each(function(ef) {
                ef.baseParams = Kwf.clone(this.getBaseParams());
                var panel = Ext.ComponentMgr.create(ef);
                this.grid.addBinding(panel);
                this.editPanels.push(panel);
            }, this);
            this.contentEditComponents.each(function(ec) {
                this.editPanels.push(Kwf.Binding.AbstractPanel.createFormOrComponentPanel(
                    this.componentConfigs, ec, {}, this.grid
                ));
            }, this);
            this.childPanel = new Ext.TabPanel({
                region: 'center',
                activeTab: 0,
                items: this.editPanels
            });
        }

        // MultiFileUpload hinzufügen falls konfiguriert
        var westItems = [this.grid];
        if (this.multiFileUpload) {
            this.multiFileUploadPanel = new Kwf.Utils.MultiFileUploadPanel(Ext.applyIf({
                border: false,
                region: 'south',
                height: 50,
                bodyStyle: 'padding-top: 15px; padding-left:80px;',
                controllerUrl: this.controllerUrl,
                baseParams: this.baseParams,
                maxEntriesErrorMessage: this.maxEntriesErrorMessage
            }), this.multiFileUpload);
            this.multiFileUploadPanel.on('uploaded', function() {
                this.grid.reload();
            }, this);
            westItems.push(this.multiFileUploadPanel);
        }

        if (this.maxEntries && this.multiFileUploadPanel) {
            this.grid.on('load', function() {
                if (this.maxEntries - this.grid.getStore().getCount()) {
                    this.multiFileUploadPanel.maxNumberOfFiles = this.maxEntries - this.grid.getStore().getCount();
                }
            }, this);
        }

        this.westPanel = new Ext.Panel({
            layout: 'border',
            region: 'west',
            split: true,
            width: this.listWidth,
            border: false,
            items: westItems,
            collapsible : true,
            title: this.listTitle
        });

        this.items = [this.westPanel, this.childPanel];
        this.callParent(arguments);
    },

    load: function()
    {
        this.grid.load();
        this.grid.selectId(false);

        // Alle Forms leeren wenn Seite neu geladen wird
        this.editPanels.each(function(panel) {
            panel.setBaseParams(this.getBaseParams());
            if (panel.getForm) {
                var f = panel.getForm();
                if (f) {
                    f.clearValues();
                    f.clearInvalid();
                }
            }
            panel.disable();
        }, this);
    },

    onAddClick : function()
    {
        Ext.Ajax.request({
            mask: true,
            url: this.controllerUrl + '/json-insert',
            params: this.getBaseParams(),
            success: function(response, options, r) {
                this.grid.getSelectionModel().clearSelections();
                this.reload({
                    callback: function(o, r, s) {
                        this.grid.getSelectionModel().select(this.grid.store.getCount() - 1);
                        if (this.childPanel.setActiveTab) {
                            this.childPanel.setActiveTab(0);
                        }
                    },
                    scope: this
                });
            },
            scope: this
        });
    },

    applyBaseParams: function(baseParams) {
        if (this.multiFileUploadPanel) {
            this.multiFileUploadPanel.applyBaseParams(baseParams);
        }
        return this.callParent(arguments);
    },
    setBaseParams : function(baseParams) {
        if (this.multiFileUploadPanel) {
            this.multiFileUploadPanel.setBaseParams(baseParams);
        }
        return this.callParent(arguments);
    },

    onCopy: function()
    {
        var params = Kwf.clone(this.getBaseParams());
        params.id = this.grid.getSelectedId();
        Ext.Ajax.request({
            url: this.controllerUrl+'/json-copy',
            params: params,
            mask: this.el
        });
    },
    onPaste: function()
    {
        Ext.Ajax.request({
            url: this.controllerUrl+'/json-paste',
            params: this.getBaseParams(),
            mask: this.el,
            maskText : trlKwf('Pasting...'),
            scope: this,
            success: function() {
                this.grid.getSelectionModel().clearSelections();
                this.reload({
                    callback: function(o, r, s) {
                        this.grid.getSelectionModel().select(this.grid.store.getCount() - 1);
                        if (this.childPanel.setActiveTab) {
                            this.childPanel.setActiveTab(0);
                        }
                    },
                    scope: this
                });
            }
        });
    }
});
