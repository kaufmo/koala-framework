Ext.define('Kwc.TextImage.ImageEnlarge.ImageUploadField', {
    extend: 'Kwc.Basic.ImageEnlarge.ImageUploadField',
    alias: 'widget.kwc.textimage.imageenlarge.imageuploadfield',
    uses: [
        'Kwc.Abstract.Cards.ComboBox'
    ],
    afterRender: function() {
        this.callParent(arguments);
        var actionField = this._findActionCombobox();
        actionField.on('changevalue', function (combo, value, index) {
            this._checkForImageTooSmall();
        }, this);
    },

    _findActionCombobox: function () {
        var actionSelectFields = this.findParentBy(function (component, container){
            if (component.identifier == 'kwc-basic-imageenlarge-form') {
                return true;
            }
            return false;
        }, this).queryBy(function (component, container) {
            if (component instanceof Kwc.Abstract.Cards.ComboBox) {
                return true;
            }
            return false;
        }, this);
        return actionSelectFields[0];
    },

    _isValidateImageTooSmallUsingImageEnlargeDimensions: function () {
        // check if dropdown has selected imageenlarge
        var actionField = this._findActionCombobox();
        var action = actionField.defaultValue;
        if (actionField.getValue()) {
            action = actionField.getValue();
        }
        return action == 'enlarge';
    }
});
