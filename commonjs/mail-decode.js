var $ = require('jQuery');
var onReady = require('kwf/on-ready');

$(document).on('click', 'a', function(event) {
    var el = event.currentTarget;
    var atDecoding = '(kwfat)';
    var dotDecoding = '(kwfdot)';

    if (el.href && el.href.match(/^mailto:/)) {
        el.href = el.href.replace(atDecoding, '@');
        el.href = el.href.replace(dotDecoding, '.');
    }
});

onReady.onRender('span.kwfEncodedMail', function decodeMail(el)
{
    var atDecoding = '(kwfat)';
    var dotDecoding = '(kwfdot)';

    el = el.get(0);
    var txt = el.innerHTML;
    txt = txt.replace(atDecoding, '@');
    el.innerHTML = txt.replace(dotDecoding, '.');
}, { defer: false, checkVisibility: true });
