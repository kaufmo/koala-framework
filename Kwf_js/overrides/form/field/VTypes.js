Ext.define('Kwf.overrides.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    email: function (v) {
        return /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(v);
    },
    emailMask: /[a-z0-9_\.\-@+]/i, //include +

    url: function (v) {
        //regexp copied from ext5
        return /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i.test(v);
    },

    urltel: function (v) {
        if (/^tel:\+?[\d\s-\.]+$/.test(v)) {
            return true;
        }
        return Ext.form.field.VTypes.url(v);
    },
    urltelText: trlKwf('This field should be a URL in the format "http://www.domain.com" or tel:0043 1234'),

    //Ersetzt alles außer a-z, 0-9 - durch _. So wie Kwf_Filter_Ascii
    //standard-ext implementierung überschrieben um den - zu erlauben
    alphanum: function (v) {
        return /^[a-zA-Z0-9_\-]+$/.test(v);
    },
    alphanumText: trlKwf('This field should only contain letters, numbers, - and _'),
    alphanumMask: /[a-z0-9_\-]/i,

    num: function (v) {
        return /^[0-9]+$/.test(v);
    },
    numText: trlKwf('This field should only contain numbers'),
    numMask: /[0-9]/,

    time: function (val, field) {
        return /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/i.test(val);
    },
    timeText: trlKwf('Not a valid time.  Must be in the format "12:34:00".'),
    timeMask: /[\d:]/i
});