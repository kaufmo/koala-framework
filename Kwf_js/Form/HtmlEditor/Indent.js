Ext.define('Kwf.Form.HtmlEditor.Indent', {
    extend: 'Ext.mixin.Observable',
    requires: [
        'Ext.button.Button'
    ],
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('afterRender', this.afterCreateToolbar, this);
        this.cmp.afterMethod('updateToolbar', this.updateToolbar, this);
    },

    // private
    afterCreateToolbar: function() {
        this.indentAction = new Ext.Button({
            handler: function() {
                this.cmp.tinymceEditor.editorCommands.execCommand('Indent');
            },
            scope: this,
            icon: '/assets/silkicons/text_indent.png',
            tooltip: {
                cls: 'x-html-editor-tip',
                title: trlKwf('Indent'),
                text: trlKwf('Increase Indent.')
            },
            cls: 'x-btn-icon',
            clickEvent: 'mousedown',
            tabIndex: -1
        });
        this.outdentAction = new Ext.Button({
            handler: function() {
                this.cmp.tinymceEditor.editorCommands.execCommand('Outdent');
            },
            scope: this,
            icon: '/assets/silkicons/text_indent_remove.png',
            tooltip: {
                cls: 'x-html-editor-tip',
                title: trlKwf('Indent'),
                text: trlKwf('Decrease Indent.')
            },
            cls: 'x-btn-icon',
            clickEvent: 'mousedown',
            tabIndex: -1
        });
        var tb = this.cmp.getToolbar();
        tb.insert(8, this.indentAction);
        tb.insert(9, this.outdentAction);
    },
    updateToolbar: function() {
        var ec = this.cmp.tinymceEditor.editorCommands;
        if (!ec.queryCommandState('InsertUnorderedList') && !ec.queryCommandState('InsertOrderedList')) {
            this.indentAction.disable();
            this.outdentAction.disable();
        } else {
            this.indentAction.enable();
            this.outdentAction.enable();
        }
    }
});
