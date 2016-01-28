Ext.define('Kwf.Form.ImageViewer', {
    extend: 'Kwf.Form.ShowField',
    alias: 'widget.imageviewer',
    tpl: '<tpl if="previewUrl">'+
        '<tpl if="imageUrl">'+
            '<a href="{imageUrl}" target="_blank">'+
        '</tpl>'+
        '<img src="{previewUrl}" />'+
        '<tpl if="imageUrl">'+
            '</a>'+
        '</tpl>'+
    '</tpl>'
});
