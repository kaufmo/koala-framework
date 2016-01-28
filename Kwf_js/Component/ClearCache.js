Ext.define('Kwf.Component.ClearCache', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.kwf.component.clearCache',
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Kwf.Auto.FormPanel',
        'Ext.window.MessageBox'
    ],
    bodyStyle: 'padding: 50px;',
    scrollable: true,
    initComponent: function() {
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);

        var body = this.body.down('#mainPanel-innerCt');

        body.createChild({
            style: 'font-size: 12px; margin-bottom: 20px;',
            html: '<h1>Manually Clear Cache</h1>It should not be necessary to clear the cache manually, you can still do it here'
        });

        body.createChild({
            style: 'font-size: 12px',
            html: 'Content changed in the CMS isn\'t shown on the website'
        });

        this.formPanel = new Ext.form.Panel({
            renderTo: body,
            baseCls: 'x-plain',
            labelWidth: 180,
            items: [new Ext.form.FieldSet({
                title: 'Filter',
                autoHeight: true,
                width: 400,
                defaults: {
                    labelWidth: 150
                },
                items: [
                    {
                        style: 'font-size: 12px; ',
                        html: 'Use % as placeholder',
                        border: false
                    },
                    new Ext.form.field.Text({
                        fieldLabel: 'component_id',
                        name: 'id'
                    }),
                    new Ext.form.field.Text({
                        fieldLabel: 'db_id',
                        name: 'dbId'
                    }),
                    new Ext.form.field.Text({
                        fieldLabel: 'expanded_component_id',
                        name: 'expandedId'
                    }),
                    new Ext.form.field.Text({
                        fieldLabel: 'type',
                        name: 'type'
                    }),
                    new Ext.form.field.Text({
                        fieldLabel: 'component_class',
                        name: 'class'
                    })
                ]
            })]
        });

        new Ext.button.Button({
            text: 'Clear View Cache',
            icon: '/assets/silkicons/page_white_text.png',
            cls: 'x-btn-text-icon',
            renderTo: body,
            style: 'margin-bottom: 20px',
            scope: this,
            handler: function() {
                Ext.Ajax.request({
                    url: this.controllerUrl+'/json-clear-view-cache',
                    params: this.formPanel.getForm().getValues(),
                    mask: true,
                    maskText: trlKwf('clearing cache...'),
                    success: function(response, options) {
                        var result = Ext.JSON.decode(response.responseText);
                        Ext.Msg.show({
                            title:trlKwf('Clear Cache'),
                            msg: 'This will clear '+result.entries+' view cache entries. Continue?',
                            buttons: Ext.Msg.OKCANCEL,
                            scope: this,
                            fn: function(button) {
                                if (button == 'ok') {
                                    var params = this.formPanel.getForm().getValues();
                                    params.force = true;
                                    Ext.Ajax.request({
                                        url: this.controllerUrl+'/json-clear-view-cache',
                                        params: params,
                                        mask: true,
                                        maskText: trlKwf('clearing cache...')
                                    });
                                }
                            }});

                    },
                    scope: this
                });
            }
        });

        new Kwf.Auto.FormPanel({
            title: 'Yep, it was a cache issue, inform developers',
            border: true,
            controllerUrl: this.controllerUrl,
            renderTo: body
        });
    }
});
