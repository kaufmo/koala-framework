Ext.define('Kwf.overrides.util.Format', {
    override: 'Ext.util.Format',
    boolean: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col'+(v?'-on':'')+'">&#160;</div>';
    },
    booleanTickCross: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col kwf-check-tick-cross-col'+(v?'-on':'')+'">&#160;</div>';
    },
    booleanRtr: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col kwf-check-rtr-col'+(v?'-on':'')+'">&#160;</div>';
    },
    booleanText: function(v, p, record) {
        return v && v != '0' ? trlKwf('Yes') : trlKwf('No');
    },
    booleanIcon: function(value, p, record, rowIndex, colIndex, store, column) {
        if (value && value != '0') {
            if (column && column.tooltip) {
                p.attr += ' title="'+column.tooltip+'"';
            }
            if (column && column.icon) {
                return '<div class="x-grid3-check-col" style="background-image:url('+column.icon+')">&#160;</div>';
            }
        }
        return '';
    },
    password: function(value) {
        return value||true ? '******' : '';
    },
    euroMoney: function(v, p) {
        return Ext.util.Format.money(v,p) + " €";
    },
    decimal: function(v, p) {
        if (p) {
            if (p.css) {
                p.css += ' kwf-renderer-decimal';
            } else {
                p.css = 'kwf-renderer-decimal';
            }
        }
        if (v === null || v == undefined) return "";

        v = Ext.util.Format.htmlEncode(v);

        v = v.toString().replace(",", ".");
        v = (Math.round((v-0)*100))/100;
        v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
        v = v.toString().replace(".", ",");
        return v;
    },
    money: function(v, p) {
        v = Ext.util.Format.decimal(v, p);
        var preSign = v.substr(0, 1) == '-' ? '-' : '';
        var x = '';
        x = v.substr(0, v.lastIndexOf(','));
        if (x.substr(0, 1) == '-') x = x.substr(1, x.length-1);
        ret = '';
        while (x.length > 3) {
            ret = "." + x.substr(x.length-3, 3) + ret;
            x = x.substr(0, x.length-3);

        }
        ret = preSign+x+ret+v.substr(v.length-3, 3);
        return ret;
    },
    showField: function(fieldName) {
        return function(value, p, record) {
            return Ext.util.Format.htmlEncode(record.data[fieldName]);
        };
    },
    nl2Br: Ext.util.Format.nl2br,
    AutoNl2Br: function(v) {
        //span wird in v gesetzt, da er sonst wieder überschrieben wird
        return "<span class=\'kwf-renderer-linebreak\'>"+Ext.util.Format.nl2Br(v)+"</span>";
    },
    component: function(v, f) {
        f.css += 'content';
        f.attr += 'style="overflow: visible; white-space: normal;"';
        return v;
    },
    //date-funktion überschreiben, damit Y-m-d als eingabeformat verwendet werden kann
    date: function(v, format) {
        if(!v){
            return '';
        }
        if(!(v instanceof Date)){
            var tmpv = new Date(Date.parseDate(v, 'Y-m-d'));
            if (isNaN(tmpv.getYear())) {
                tmpv = new Date(Date.parseDate(v, 'Y-m-d H:i:s'));
            }
            v = tmpv;
        }
        if(isNaN(v.getYear())){
            return '';
        }
        return v.dateFormat(format || trlKwf('Y-m-d'));
    },
    localizedDate: Ext.util.Format.dateRenderer(trlKwf('Y-m-d')),
    localizedDatetime: Ext.util.Format.dateRenderer(trlKwf('Y-m-d H:i')),
    germanDate: Ext.util.Format.dateRenderer('d.m.Y'),
    germanDay: function(value, p) {
        p.css += 'kwf-renderer-bright';
        return Ext.util.Format.date(value, 'd.m.');
    },
    time: function(value) {
        var time = /^..:..:..$/.exec(value); //regex by Michael "regex noob" Freudenthaler
        if (time) {
            value = value.split(':');
            return value[0]+':'+value[1];
        }
        return Ext.util.Format.date(value, 'H:i');
    },
    secondsToTime: function(v, format) {
        format.css += 'secondsToTimeRight';

        if(!v){
            return '0:00';
        }

        var seconds = parseInt(v) % 60;
        var minutes = Math.floor(parseInt(v)/60) % 60;
        var hours = Math.floor(parseInt(v)/3600) % 3600;

        var ret = hours+':';
        if (minutes < 10) ret += '0';
        ret += minutes;

        return ret;
    },
    mouseoverPic: function(v, p, record) {
        if (!v) return '';
        p.css += 'kwf-cell-button';
        v = Ext.util.Format.htmlEncode(v);
        p.attr += 'style="background-image:url('+v+');"';
        p.attr += ' ext:qtip="&lt;img src=\''+record.data.pic_large+'\' /&gt;"';
        return '';
    },
    cellButton: function(value, p, record, rowIndex, colIndex, store, column) {
        if (value != 'invisible') {
            if (column && column.noIconWhenNew && !record.data.id) {
                p.attr += 'style="background-image:none;" ';
            } else {
                p.css += 'kwf-cell-button';
                if (column && column.buttonIcon) {
                    p.attr += 'style="background-image:url('+column.buttonIcon+');" ';
                }
                if (column && column.tooltip) {
                    p.attr += ' ext:qtip="'+column.tooltip+'"';
                }
            }
        }
        return '';
    },
    cellButtonText: function(value, p, record, rowIndex, colIndex, store, column) {
        var name = '';
        if (value != 'invisible') {
            if (column && column.noIconWhenNew && !record.data.id) {
                p.attr += 'style="background-image:none;" ';
            } else {
                p.css += 'kwf-cell-button-text';
                if (column && column.buttonIcon) {
                    p.attr += 'style="background-image:url('+column.buttonIcon+');" ';
                }
                if (column && column.tooltip) {
                    p.attr += ' ext:qtip="'+column.tooltip+'"';
                    name = column.tooltip;
                }
            }
        }
        if (column && column.editName) name = column.editName;
        return name;
    },
    genderIcon: function(value, p, record, rowIndex, colIndex, store, column) {
        p.css += 'kwf-cell-button';
        if (value == 'male') {
            p.attr += 'style="background-image:url(/assets/silkicons/male.png); cursor: auto;"" ';
        } else if (value == 'female') {
            p.attr += 'style="background-image:url(/assets/silkicons/female.png); cursor: auto;"" ';
        } else {
            p.attr += 'style="background-image:none; cursor: auto;"" ';
        }
        if (column && column.tooltip) {
            p.attr += ' ext:qtip="'+column.tooltip+'"';
        }
        return '';
    },
    genderText: function(value, p, record, rowIndex, colIndex, store, column) {
        var ret = '';
        if (value == 'male') {
            ret = trlKwf('Male');
        } else if (value == 'female') {
            ret = trlKwf('Female');
        }
        return ret;
    },
    fileSize: function(size) {
        var unit;
        if (!parseInt(size) && size !== 0) return '';
        size = parseInt(size);
        if(size < 1024) {
            unit = 'bytes';
        } else if(size < 1048576) {
            unit = 'KB';
            size = (Math.round(((size*10) / 1024))/10);
        } else {
            unit = 'MB';
            size = (Math.round(((size*10) / 1048576))/10);
        }
        return size.toString().replace(".", ",") + ' ' + unit;
    },
    notEditable: function(v, p) {
        p.css += 'kwf-renderer-noteditable';
        v = Ext.util.Format.htmlEncode(v);
        return v;
    },
    image: function(v, p, record) {
        if (!v) return '';
        p.css += 'kwf-cell-icon';
        p.attr += 'style="';
        var url;
        if (typeof(v) == 'string') {
            v = { previewUrl: v };
        }
        if (v.previewUrl) p.attr += 'background-image:url('+v.previewUrl+'); ';
        if (v.previewHeight) p.attr += 'height: '+v.previewHeight+'px; ';
        p.attr += '"';

        if (v.hoverUrl) {
            p.attr += ' ext:qtip="&lt;img src=\''+v.hoverUrl+'\' ';
            if (v.hoverWidth) p.attr += 'width=\''+v.hoverWidth+'\' ';
            if (v.hoverHeight) p.attr += 'height=\''+v.hoverHeight+'\' ';
            p.attr += '/&gt;"';
        }

        return '';
    },
    clickableLink: function(v, p, record) {
        if (!v) return '';
        v = Ext.util.Format.htmlEncode(v);
        return '<a href="'+v+'" target="_blank">'+v+'</a>';
    },
    clickableMailLink: function(v, p, record) {
        if (!v) return '';
        v = Ext.util.Format.htmlEncode(v);
        return '<a href="mailto:'+v+'" target="_blank">'+v+'</a>';
    },
    tableTrl: function(v, p, record, rowIndex, colIndex, store, column) {
        if (!v || v == '') {
            v = record.data[column.dataIndex+'data'];
            v = Ext.util.Format.htmlEncode(v);
            p.attr += 'style="background: url(/assets/silkicons/link.png) no-repeat right center; border: 1px solid #b4e889; padding-right: 20px;"';
        } else {
            p.attr += 'style="background: url(/assets/silkicons/link_break.png) no-repeat right center; border: 1px solid #f16565; padding-right: 20px;"';
        }
        return v;
    },
    newsletterState: function(v, p, record) {
        if (!v) return '';
        if (v == trlKwf('unsubscribed')) {
            return '<span class="unsubscribed">'+v+'</span>';
        } else if (v == trlKwf('not activated')) {
            return '<span class="inactive">'+v+'</span>';
        } else if (v == trlKwf('active')) {
            return '<span class="active">'+v+'</span>';
        }
        return v;
    },
    raw: function(v, p) {
        return v;
    }
});
