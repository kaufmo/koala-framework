Ext.define('Kwf.Auto.AssignGridPanel', {
    extend: 'Kwf.Binding.ProxyPanel',
    alias: 'widget.kwf.assigngrid',
    requires: [
        'Ext.Action',
        'Kwf.Auto.AssignedGridPanel',
        'Ext.selection.CheckboxModel',
        'Kwf.Auto.GridPanel'
    ],
    gridAssignedControllerUrl: '',
    gridDataControllerUrl: '',
    textAssignActionUrl: null,

    gridDataHeight: 410,

    assignActionUrl: '',
    gridDataParamName: 'foreign_keys',

    initComponent: function()
    {
        this.actions.assign = new Ext.Action({
            text    : trlKwf('Assign'),
            icon    : '/assets/silkicons/table_relationship.png',
            cls     : 'x-btn-text-icon',
            disabled: true,
            handler : this.onAssign,
            scope   : this
        });

        if (this.assignActionUrl == '') {
            this.assignActionUrl = this.gridAssignedControllerUrl + '/json-assign';
        }

        this.gridAssigned = new Kwf.Auto.AssignedGridPanel({
            controllerUrl: this.gridAssignedControllerUrl,
            textAssignActionUrl: this.textAssignActionUrl,
            region: 'center',
            gridConfig: {
                selModel: new Ext.selection.CheckboxModel()
            }
        });
        this.proxyItem = this.gridAssigned;

        this.gridData = new Kwf.Auto.GridPanel({
            region: 'south',
            split: true,
            height: this.gridDataHeight,
            controllerUrl: this.gridDataControllerUrl,
            gridConfig: {
                tbar: [ this.getAction('assign'), '-' ],
                selModel: new Ext.selection.CheckboxModel()
            },
            autoLoad: this.autoLoad
        });

        this.gridAssigned.on('datachange', function() {
            this.gridData.reload();
        }, this);

        this.relayEvents(this.gridAssigned, ['datachange']);


        this.gridData.on('selectionchange', function() {
            if (this.gridData.getSelectionModel().getSelections()[0]) {
                this.getAction('assign').enable();
            } else {
                this.getAction('assign').disable();
            }
        }, this);

        this.gridData.on('deleterow', function() {
            this.gridAssigned.reload();
        }, this);

        this.gridData.on('datachange', function() {
            this.gridAssigned.reload();
        }, this);

        this.layout = 'border';

        this.items = [this.gridAssigned, this.gridData];

        this.callParent(arguments);
    },

    onAssign : function()
    {
        if (!this.gridData.getSelectionModel().getSelections()) return;
        var params = this.gridAssigned.getBaseParams();
        params[this.gridDataParamName] = [];

        var selections = this.gridData.getSelectionModel().getSelections();
        for (var i in selections) {
            if (selections[i].id) {
                params[this.gridDataParamName].push(selections[i].id);
            }
        }
        params[this.gridDataParamName] = Ext.encode(params[this.gridDataParamName]);

        Ext.Ajax.request({
            url: this.assignActionUrl,
            params: params,
            success: function() {
                this.gridAssigned.reload();
                this.gridData.reload();
                this.fireEvent('assigned', this);
            },
            scope: this
        });
    },

    reloadDataGrid: function() {
        return this.gridData.reload.apply(this.gridData, arguments);
    },

    setAutoLoad: function(v) {
        this.callParent(arguments);
        this.gridData.setAutoLoad(v);
    },
    load: function() {
        this.callParent(arguments);

        //wenn autoLoad=false
        if (!this.gridData.getStore()) {
            this.gridData.load();
        }
    },

    setBaseParams: function(bp) {
        this.gridAssigned.setBaseParams(bp);
        this.gridData.setBaseParams(bp);
        return this.callParent(arguments);
    },

    applyBaseParams: function(bp) {
        this.gridAssigned.applyBaseParams(bp);
        this.gridData.applyBaseParams(bp);
        return this.callParent(arguments);
    }

});
