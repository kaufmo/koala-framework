Ext.define('Kwf.Form.HtmlEditor.Formats', {
    extend: 'Ext.mixin.Observable',
    requires: [
        'Ext.button.Button'
    ],
    init: function(cmp){
        this.cmp = cmp;
        console.log('init');
        this.cmp.on('initialize', this.onInit, this, {delay: 1, single: true});
        this.cmp.on('afterRender', this.afterCreateToolbar, this);
        this.cmp.afterMethod('updateToolbar', this.updateToolbar, this);
    },

    onInit: function() {
        this.cmp.formatter.register('bold', {
            inline: 'strong'
        });
        this.cmp.formatter.register('italic', {
            inline: 'em'
        });
    },

    // private
    afterCreateToolbar: function() {
        console.log('afterCreateToolbar');
        var tb = this.cmp.getToolbar();
        this.boldAction = new Ext.Button({
            handler: this.onBold,
            scope: this,
            tooltip: {
                title: trlKwf('Bold (Ctrl+B)'),
                text: trlKwf('Make the selected text bold.'),
                cls: 'x-html-editor-tip'
            },
            cls : 'x-btn-icon x-edit-bold',
            clickEvent: 'mousedown',
            tabIndex: -1,
            enableToggle: true
        });
        tb.insert(0, this.boldAction);

        this.italicAction = new Ext.Button({
            handler: this.onItalic,
            scope: this,
            tooltip: {
                title: trlKwf('Italic (Ctrl+I)'),
                text: trlKwf('Make the selected text italic.'),
                cls: 'x-html-editor-tip'
            },
            cls : 'x-btn-icon x-edit-italic',
            clickEvent: 'mousedown',
            tabIndex: -1,
            enableToggle: true
        });
        tb.insert(1, this.italicAction);
    },

    updateToolbar: function()
    {
        var m = this.cmp.formatter.match('bold');
        this.boldAction.toggle(typeof m == 'undefined' ? false : m);

        var m = this.cmp.formatter.match('italic');
        this.italicAction.toggle(typeof m == 'undefined' ? false : m);
    },

    onBold: function()
    {
        this.cmp.formatter.toggle('bold');
        this.cmp.deferFocus();
        this.cmp.updateToolbar();
    },

    onItalic: function()
    {
        this.cmp.formatter.toggle('italic');
        this.cmp.deferFocus();
        this.cmp.updateToolbar();
    }
});