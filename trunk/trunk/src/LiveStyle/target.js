var LiveStyle = {
    open: function(options) {
        options = options || {};
        options.width = options.width || 400;
        options.height = options.height || screen.availHeight;
        options.openerOffset = options.openerOffset || 10;
        this.options = options;
        var editor = window.open('$path?resource=editor.htm', 'LiveStyle', 'resizable=1,toolbar=0,width=' + options.width + ',height=' + options.height);
    }
};