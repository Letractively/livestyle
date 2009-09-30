var select, save, status;
var currentCssFile;
var editor;

function assignUI() {
    select = $('select');
    save = $('#save');
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

function resizeEditor() {
    $(editor.frame).css('height', $(window).height() - 32);
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
    file = (file.charAt(0) == '/') ? file : (openersPath() + file);
    $.get(window.location.pathname, { file: file, force: new Date().getTime() }, function(css) {
        editor.setCode(css);
        currentCssFile = file;
    });
}

function saveCss() {
    status.text('Saving...').fadeIn();

    var url = window.location.toString().match(/^(.*)\?|$/)[1];
    var file = (currentCssFile.charAt(0) == '/') ? currentCssFile : (openersPath() + currentCssFile);
    $.ajax({
        type: 'post',
        url: url + '?file=' + file,
        data: editor.getCode(),
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

$(function() {

    editor = CodeMirror.fromTextArea('t', {
        height: "100%",
        parserfile: "parsecss.js",
        stylesheet: "$path?resource=CodeMirror/css/csscolors.css",
        path: "$path?resource=CodeMirror/js/",
        textWrapping: false,
        saveFunction: saveCss,
        initCallback: function() {
            assignUI();
            addStylesheetsToSelect();
            resizeEditor();
            positionWindows();
            attachOpenerUnloadToClose();

            select.change(loadCss);
            save.click(saveCss);
            $(window).resize(resizeEditor);

            if (select.val()) {
                loadCss();
            }
        }
    });

});

