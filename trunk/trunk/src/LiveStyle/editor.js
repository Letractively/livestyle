var select, save, textarea, status;
var currentCssFile;

function assignUI() {
    select = $('select');
    save = $('#save');
    textarea = $('textarea');
    status = $('#status');
}

function addStylesheetsToSelect() {
    var links = $('link[type=text/css]', window.opener.document);
    links.each(function() {
        var href = $(this).attr('href');
        if (/^http(s?)\:/.exec(href)) return; // skip absolute URLs
        var q = href.indexOf('?');
        if (q >= 0) {
            href = href.substr(0, q);
        }
        select.append('<option value="' + href + '">' + href + '</option>');
    });
}

function fitTextArea() {
    textarea.css('height', $(window).height() - textarea.position().top - 2);
}

function positionWindows() {
    window.moveTo(0, 0);
    var options = window.opener.LiveStyle.options;
    window.opener.moveTo(options.width + options.openerOffset, 0);
}

function attachOpenerUnloadToClose() {
    if (window.addEventListener) {
        window.opener.addEventListener('unload', function() {
            window.close();
        }, false);
    } else {
        window.opener.attachEvent('onunload', function() {
            window.close();
        });
    }
}

function openersPath() {
    var path = window.opener.location.pathname;
    var index = path.lastIndexOf('/');
    return path.substr(0, index + 1);
}

function loadCss() {
    var file = select.val();
    $.get(window.location.toString(), { file: openersPath() + file, force: new Date().getTime() }, function(css) {
        textarea.val(css);
        currentCssFile = file;
    });
}

function saveCss() {
    status.text('Saving...').fadeIn();

    var url = window.location.toString().match(/^(.*)\?|$/)[1];
    var file = openersPath() + currentCssFile;
    $.ajax({
        type: 'post',
        url: url + '?file=' + file,
        data: textarea.val(),
        complete: function() {
            if (window.opener && !window.opener.closed) {
                var link = $('link[href^=' + currentCssFile + ']', window.opener.document);
                link.attr('href', currentCssFile + '?' + new Date().getTime());
            }

            status.text('Saved.');
            setTimeout(function() { status.fadeOut(); }, 1000);
        }
    });
}

function keydown(e) {
    if (e.keyCode == 83 && e.ctrlKey) {
        saveCss();
        return false;
    } else if (e.keyCode == 9) {
        replaceSelection(textarea[0], String.fromCharCode(9));
        setTimeout(function() { textarea[0].focus(); }, 0);
        return false;
    }
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function replaceSelection(input, replaceString) {
    if (input.setSelectionRange) {
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;
        input.value = input.value.substring(0, selectionStart) + replaceString + input.value.substring(selectionEnd);

        if (selectionStart != selectionEnd) {
            setSelectionRange(input, selectionStart, selectionStart + replaceString.length);
        } else {
            setSelectionRange(input, selectionStart + replaceString.length, selectionStart + replaceString.length);
        }

    } else if (document.selection) {
        var range = document.selection.createRange();

        if (range.parentElement() == input) {
            var isCollapsed = range.text == '';
            range.text = replaceString;

            if (!isCollapsed) {
                range.moveStart('character', -replaceString.length);
                range.select();
            }
        }
    }
}

$(function() {
    assignUI();
    addStylesheetsToSelect();
    fitTextArea();
    positionWindows();
    attachOpenerUnloadToClose();

    select.change(loadCss);
    save.click(saveCss);
    $(document).keydown(keydown);
    $(window).resize(fitTextArea);
    
    if (select.val()) {
        loadCss();
    }
});