Ext.define('Kwf.Form.HtmlEditor.PastePlain', {
    extend: 'Ext.mixin.Observable',
    requires: [
        'Ext.window.MessageBox',
        'Ext.button.Button'
    ],
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('afterRender', this.afterCreateToolbar, this);
    },

    // private
    afterCreateToolbar: function() {
        var tb = this.cmp.getToolbar();
        tb.insert(10, new Ext.Button({
            icon: '/assets/kwf/images/pastePlain.gif',
            handler: this.onPastePlain,
            scope: this,
            tooltip: {
                cls: 'x-html-editor-tip',
                title: trlKwf('Insert Plain Text'),
                text: trlKwf('Insert text without formating.')
            },
            cls: 'x-btn-icon',
            clickEvent: 'mousedown',
            tabIndex: -1

        }));
        tb.insert(11, '-');
    },

    onPastePlain: function() {
        var bookmark = this.cmp.tinymceEditor.selection.getBookmark();
        Ext.Msg.show({
            title : trlKwf('Insert Plain Text'),
            msg : '',
            buttons: Ext.Msg.OKCANCEL,
            fn: function(btn, text) {
                if (btn == 'ok') {
                    this.cmp.tinymceEditor.selection.moveToBookmark(bookmark);
                    text = text.replace(/\r/g, '');
                    text = text.replace(/\n/g, '</p>\n<p>');
                    text = String.format('<p>{0}</p>', text);
                    this.cmp.tinymceEditor.editorCommands.execCommand('mceInsertContent', false, text);
                }
            },
            scope : this,
            minWidth: 500,
            prompt: true,
            multiline: 300
        });
    }
});
