Ext.define('Kwf.Form.ShowField', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.showfield',
    requires: [
        'Ext.XTemplate'
    ],
    defaultAutoCreate : {tag: 'div', cls: 'kwf-form-show-field'},
    /**
     * {value} wenn kein objekt übergeben, sonst index aus objekt
     */
    tpl: '{value}',

    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }
    },
    afterRender : function(){
        this.callParent(arguments);
        if (typeof this.tpl == 'string') this.tpl = new Ext.XTemplate(this.tpl);
        this.tpl.compile();
        this.setRawValue("&nbsp;"); //bugfix für IE 7 -> /kwf/test/kwf_form_show-field_value-overlaps-error
    },
    getName: function(){
        return this.name;
    },
    setRawValue : function(v){
        return this.el.update(v);
    },
    getRawValue : function(){
        return this.el.dom.innerHTML;
    },
    getValue : function()
    {
        return this.value;
    },
    setValue : function(value)
    {
        this.value = value;
        if(this.rendered){
            if (!value) {
                this.setRawValue(value);
            } else {
                if (typeof value != 'object') value = { value : value };
                this.tpl.overwrite(this.el, value);
            }
        }
        if (this.getRawValue() == '') {
            this.setRawValue("&nbsp;");
        }
    }
});
