Ext.define('Kwf.Form.HtmlEditor.Tidy', {
    extend: 'Ext.mixin.Observable',
    requires: [
        'Ext.util.DelayedTask'
    ],
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('initialize', this.onInit, this, {delay:100, single: true});
        this.cmp.afterMethod('toggleSourceEdit', this.toggleSourceEdit, this);
    },

    // private
    onInit: function(){
        Ext.get(this.cmp.getDoc()).on('keydown', function(e) {
            if (e.ctrlKey) {
                var c = e.getCharCode();
                if (c > 0) {
                    c = String.fromCharCode(c).toLowerCase();
                    if (c == 'v') {
                        if (!this.pasteDelayTask) {
                            var pasteClean = function() {
                                this.cmp.syncValue();

                                var bookmark = this.cmp.tinymceEditor.selection.getBookmark();
                                this.tidyHtml({
                                    params: { allowCursorSpan: true },
                                    callback: function() {
                                        this.cmp.tinymceEditor.selection.moveToBookmark(bookmark);
                                        this.cmp.syncValue();
                                    },
                                    scope: this
                                });
                            };
                            this.pasteDelayTask = new Ext.util.DelayedTask(pasteClean, this);
                        }
                        this.pasteDelayTask.delay(100);
                    }
                }
            }
        }, this);
    },

    toggleSourceEdit : function(sourceEditMode) {
        this.tidyHtml();
    },

    tidyHtml: function(tidyOptions)
    {
        this.cmp.mask(trlKwf('Cleaning...'));

        var params = {
            componentId: this.cmp.componentId,
            html: this.cmp.getValue()
        };
        if (tidyOptions && tidyOptions.params) {
            Ext.applyIf(params, tidyOptions.params);
        }
        Ext.Ajax.request({
            url: this.cmp.controllerUrl+'/json-tidy-html',
            params: params,
            failure: function() {
                this.cmp.unmask();
            },
            success: function(response, options, r) {
                this.cmp.unmask();

                if (this.cmp.getValue() != r.html) {
                    this.cmp.setValue(r.html);
                }

                if (tidyOptions && tidyOptions.callback) {
                    tidyOptions.callback.call(tidyOptions.scope || this);
                }
            },
            scope: this
        });
    }
});
