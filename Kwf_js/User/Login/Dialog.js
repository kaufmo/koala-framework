Ext.define('Kwf.User.Login.Dialog', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.button.Button'
    ],
    initComponent: function()
    {
        this.height = 275+50;
        this.width = 310;
        this.modal = true;
        this.title = trlKwf('Login');
        this.resizable = false;
        this.closable = true;
        this.layout = 'border';
        this.loginPanel = new Ext.Panel({
            baseCls: 'x-plain',
            region: 'center',
            border: false,
            height: 120,
            html: '<iframe scrolling="no" src="/kwf/user/login/show-form" width="100%" '+
                    'height="100%" style="border: 0px"></iframe>'
        });
        this.lostPasswordButton = new Ext.Button({
            text    : trlKwf('Lost password?'),
            style   : 'position: absolute; z-index: 500000; margin-top: -40px; margin-left: -270px;',
            handler : this.lostPassword,
            scope   : this,
            hidden  : true
        });
        this.loginPanelContainer = new Ext.Panel({
            baseCls: 'x-plain',
            region: 'center',
            border: false,
            layout: 'fit',
            height: 120,
            buttons: [
                this.lostPasswordButton
            ]
        });
        this.redirectsPanel = new Ext.Panel({
            baseCls: 'x-plain',
            region: 'south',
            height: 100,
            border: false
        });

        this.items = [{
            baseCls: 'x-plain',
            cls: 'kwf-login-header',
            region: 'north',
            height: 80,
            autoLoad: '/kwf/user/login/header',
            border: false
        },{
            region: 'center',
            baseCls: 'x-plain',
            border: false,
            items: [{
                baseCls: 'x-plain',
                region: 'north',
                height: 40,
                bodyStyle: 'padding: 10px;',
                html: this.message,
                border: true
            }, this.loginPanelContainer,
               this.redirectsPanel
            ]
        }, ];

        Ext.Ajax.request({
            url: '/kwf/user/login/json-get-auth-methods',
            success: function(response, options, r) {
                if (r.showPassword) {
                    this.lostPasswordButton.show();
                    this.loginPanelContainer.add(this.loginPanel);
                    this.loginPanelContainer.updateLayout();
                }
                if (r.redirects.length) {
                    var tpl = new Ext.XTemplate([
                        '<ul>',
                        '<tpl for=".">',
                            '<li>',
                            '<form>',
                            '<tpl for="formOptions">',
                                '<tpl if="type == \'select\'">',
                                    '<select name="{name}">',
                                    '<tpl for="values">',
                                        '<option value="{value}">{name}</option>',
                                    '</tpl>',
                                    '</select>',
                                '</tpl>',
                            '</tpl>',
                            '<a href="{url:htmlEncode}">',
                            '<tpl if="icon">',
                                '<img src="{icon}" />',
                            '</tpl>',
                            '<tpl if="!icon">',
                                '{name:htmlEncode}',
                            '</tpl>',
                            '</a>',
                            '</form>',
                            '</li>',
                        '</tpl>',
                        '</ul>'
                    ]);
                    tpl.overwrite(this.redirectsPanel.body, r.redirects);
                    this.redirectsPanel.body.query('a', false).each(function(a) {
                        a.on('click', function(ev) {
                            ev.preventDefault();
                            window.ssoCallback = (function(sessionToken) {
                                Kwf.sessionToken = sessionToken;
                                this.afterLogin();
                                delete window.ssoCallback;
                            }).bind(this);
                            var values = Ext.dom.Element.serializeForm(Ext.fly(ev.getTarget()).parent('form').dom);
                            var href = Ext.fly(ev.getTarget()).parent('a').dom.href;
                            href += '&redirect=jsCallback&'+values;
                            window.open(href, 'sso', 'width=800,height=600');
                        }, this);
                    }, this);
                } else {
                    this.setHeight(275);
                }
            },
            scope: this
        });

        this.loginPanel.on('render', function(panel) {
            var frame = this.loginPanel.body.selectNode('iframe', false);
            // IE sux :)
            // Das direkte this.onLoginLoad() in der nächsten Zeile muss wegen IE sein
            // da der das tlw. direkt im cache hat und das frame.onLoad nicht mitkriegt
            this.onLoginLoad();
            frame.on('load', this.onLoginLoad, this);
        }, this, { delay: 1 });


        this.callParent(arguments);
    },

    _getDoc: function() {
        var frame = this.loginPanel.body.selectNode('iframe', false);
        if(Ext.isIE){
            return frame.dom.contentWindow.document;
        } else {
            return (frame.dom.contentDocument || window.frames[id].document);
        }
    },

    onLoginLoad : function() {
        var doc = this._getDoc();

        if(doc && doc.body){
            if (doc.body.innerHTML.match(/successful/)) {
                var sessionToken = doc.body.innerHTML.match(/sessionToken:([^:]+):/);
                if (sessionToken[1]) {
                    Kwf.sessionToken = sessionToken[1];
                }
                this.afterLogin();
            } else if (doc.getElementsByName('username').length >= 1) {
                if (doc.activeElement && doc.activeElement.tagName.toLowerCase() != 'input') { //only focus() if not password has focus (to avoid users typing their password into username)
                    doc.getElementsByName('username')[0].focus();
                }
            }
        }
    },

    afterLogin: function()
    {
        this.hide();
        if (this.location) {
            location.href = this.location;
        } else {
            if (Kwf.menu) Kwf.menu.reload();
            if (this.success) {
                Ext.callback(this.success, this.scope);
            }
        }
    },

    lostPassword: function() {
        location.href = '/kwf/user/login/lost-password';
    },

    showLogin: function() {
        this.show();
    }
});

