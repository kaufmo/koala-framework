Ext.define('Kwf.overrides.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    requires: [
        'Kwf.Form.HtmlEditor.Formats',
        'Kwf.Form.HtmlEditor.UndoRedo',
        'Kwf.Form.HtmlEditor.InsertChar',
        'Kwf.Form.HtmlEditor.PastePlain',
        'Kwf.Form.HtmlEditor.Indent',
        'Kwf.Form.HtmlEditor.InsertLink',
        'Kwf.Form.HtmlEditor.InsertDownload',
        'Kwf.Form.HtmlEditor.RemoveLink',
        'Kwf.Form.HtmlEditor.InsertImage',
        'Kwf.Form.HtmlEditor.Tidy',
        'Kwf.Form.HtmlEditor.Styles',
        'Kwf.Form.HtmlEditor.BreadCrumbs'
    ],
    enableUndoRedo: true,
    enableInsertChar: true,
    enablePastePlain: true,
    enableStyles: false,

    initComponent : function()
    {
        //if (!this.plugins) this.plugins = [];
        if (this.enableFormat) {
            this.addPlugin(new Kwf.Form.HtmlEditor.Formats());
            this.enableFormat = false; //ext implementation deaktivieren, unsere ist besser
        }
        if (this.enableUndoRedo) {
            this.addPlugin(new Kwf.Form.HtmlEditor.UndoRedo());
        }
        if (this.enableInsertChar) {
            this.addPlugin(new Kwf.Form.HtmlEditor.InsertChar());
        }
        if (this.enablePastePlain) {
            this.addPlugin(new Kwf.Form.HtmlEditor.PastePlain());
        }
        this.addPlugin(new Kwf.Form.HtmlEditor.Indent());
        if (this.linkComponentConfig) {
            this.addPlugin(new Kwf.Form.HtmlEditor.InsertLink({
                componentConfig: this.linkComponentConfig
            }));
        }
        if (this.downloadComponentConfig) {
            this.addPlugin(new Kwf.Form.HtmlEditor.InsertDownload({
                componentConfig: this.downloadComponentConfig
            }));
        }
        if (this.linkComponentConfig || this.downloadComponentConfig) {
            this.addPlugin(new Kwf.Form.HtmlEditor.RemoveLink());
        }
        if (this.imageComponentConfig) {
            this.addPlugin(new Kwf.Form.HtmlEditor.InsertImage({
                componentConfig: this.imageComponentConfig
            }));
        }
        if (this.controllerUrl && this.enableTidy) {
            this.addPlugin(new Kwf.Form.HtmlEditor.Tidy());
        }
        if (this.enableStyles) {
            this.addPlugin(new Kwf.Form.HtmlEditor.Styles({
                styles: this.styles,
                stylesEditorConfig: this.stylesEditorConfig,
                stylesIdPattern: this.stylesIdPattern
            }));
        }
        this.addPlugin(new Kwf.Form.HtmlEditor.BreadCrumbs());

        this.callParent(arguments);
    },
    initEditor : function() {
        this.callParent(arguments);
        if (this.cssFiles) {
            this.cssFiles.forEach(function(f) {
                var s = this.getDoc().createElement('link');
                s.setAttribute('type', 'text/css');
                s.setAttribute('href', f);
                s.setAttribute('rel', 'stylesheet');
                this.getDoc().getElementsByTagName("head")[0].appendChild(s);
            }, this);
        }

        //wann text mit maus markiert wird muss die toolbar upgedated werden (link einfügen enabled)
        //dazu auch auf mouseup schauen
        Ext.get(this.getDoc()).on('mouseup', this.onEditorEvent, this, {buffer: 100});

        var tinymceEditor = function() {};
        tinymceEditor.prototype = tinymce.Editor.prototype;
        var KwfEditor = function() {
            tinymce.Editor.apply(this, arguments);
        };
        KwfEditor.prototype = new tinymceEditor();

        Ext.apply(KwfEditor.prototype, {
            orgVisibility: '',
            extEditor: this,
            getDoc: function() {
                return this.extEditor.getDoc();
            },
            getWin: function() {
                return this.extEditor.getWin();
            },
            getBody: function() {
                return this.extEditor.getEditorBody();
            },
            getElement: function() {
                return this.extEditor.el.dom;
            },
            focus: function(skip_focus) {
                tinyMCE.activeEditor = this;
                if (!skip_focus) {
                    this.extEditor.focus();
                }
            },
            setContent: function(content, args) {
                return tinymce.Editor.prototype.setContent.apply(this, arguments);
            }
        });

        var mceSettings = {
            forced_root_block: 'p'
        };
        this.tinymceEditor = new KwfEditor(this.el.id, mceSettings, tinymce.EditorManager);
        this.tinymceEditor.initContentBody(true);

        this.tinymceEditor.on('nodeChange', (function(e) {
            this.updateToolbar();
        }).bind(this));


        this.formatter = this.tinymceEditor.formatter;

        this.originalValue = this.getEditorBody().innerHTML; // wegen isDirty, es wird der html vom browser dom mit dem originalValue verglichen, wo dann zB aus <br /> ein <br> wird
    },

    // private
    // überschrieben wegen spezieller ENTER behandlung im IE die wir nicht wollen
    fixKeys : function() { // load time branching for fastest keydown performance
        if (Ext.isIE) {
            return function(e) {
                var k = e.getKey(), r;
                if (k == e.TAB){
                    e.stopEvent();
                    r = this.getDoc().selection.createRange();
                    if (r) {
                        r.collapse(true);
                        r.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                        this.deferFocus();
                    }
                    //} else if (k == e.ENTER) {
                    //entfernt, wir wollen dieses verhalten genau so wie der IE es macht
                }
            };
        } else if (Ext.isOpera) {
            return function(e) {
                var k = e.getKey();
                if (k == e.TAB) {
                    e.stopEvent();
                    this.win.focus();
                    this.execCmd('InsertHTML','&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.deferFocus();
                }
            };
        } else if (Ext.isWebKit) {
            return function(e) {
                var k = e.getKey();
                if (k == e.TAB) {
                    e.stopEvent();
                    this.execCmd('InsertText','\t');
                    this.deferFocus();
                }
            };
        }
    }(),

    getDocMarkup : function(){
        var ret = '<html><head>'+
            '<style type="text/css">'+
            'body{border:0;margin:0;padding:3px;height:98%;cursor:text;}'+
            '</style>\n';
        ret += '</head><body class="kwfUp-webStandard kwcText mce-content-body" id="tinymce" data-id="content"></body></html>';
        return ret;
    },
    setValue : function(v) {
        if (v && v.componentId) {
            this.componentId = v.componentId;
        }
        if (v && (typeof v.content) != 'undefined') v = v.content;
        this.callParent(arguments);
    },

    mask: function(txt) {
        this.el.up('div').mask(txt);
    },
    unmask: function() {
        this.el.up('div').unmask();
    },

    //private
    getFocusElement : function(tag)
    {
        if (tag == 'block') tag = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'pre', 'code', 'address'];
        var isNeededTag = function(t) {
            t = t.tagName.toLowerCase();
            if (tag.indexOf) {
                return tag.indexOf(t) != -1;
            } else {
                return tag == t;
            }
        };
        var ret = null;
        this.getParents().each(function(el) {
            if (isNeededTag(el)) {
                ret = el;
                return false;
            }
        }, this);
        return ret;
    },

    //basiert auf Editor::nodeChanged
    getParents: function() {
        var s = this.tinymceEditor.selection;
        var n = (Ext.isIE ? s.getNode() : s.getStart()) || this.tinymceEditor.getBody();
        n = Ext.isIE && n.ownerDocument != this.tinymceEditor.getDoc() ? this.tinymceEditor.getBody() : n; // Fix for IE initial state
        var parents = [];
        this.tinymceEditor.dom.getParent(n, function(node) {
            if (node.nodeName == 'BODY')
                return true;

            parents.push(node);
        });
        return parents;
    },

    //syncValue schreibt den inhalt vom iframe in die textarea
    syncValue : function(){
        if (!this.sourceEditMode && this.initialized) {
            var html = this.tinymceEditor.getContent();
            html = this.cleanHtml(html);
            if (this.fireEvent('beforesync', this, html) !== false) {
                this.el.dom.value = html;
                this.fireEvent('sync', this, html);
            }
        }
    },

    insertAtCursor : function(text) {
        if (!this.activated) {
            return;
        }
        this.tinymceEditor.editorCommands.execCommand('mceInsertContent', false, text);
    },

    execCmd : function(cmd, value) {
        this.tinymceEditor.editorCommands.execCommand(cmd, false, value);
        this.syncValue();
    }
});
