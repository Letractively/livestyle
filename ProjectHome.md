Creating and modifying CSS for a web page involves a lot of alt-tabbing between your code editor and web browser. FireBug and other dev tools let you change CSS on the fly, but won't persist changes back to your source CSS file.

LiveStyle gives you a simple, web-based, stylesheet editor for all stylesheets linked in your HTML. Make some changes, hit Ctrl+S and the stylesheet is reloaded in the browser (without needing a full page refresh). The changed stylesheet is also sent to the server to be saved.

Watch a 2 minute introduction screen cast here:
http://screencast.com/t/hhAvdK0h4Y (it's of an older version without syntax highlighting, but it works the same)

LiveStyle works by including a single .ashx handler in your ASP.NET web application. No changes need to be made to your HTML.

LiveStyle uses [CodeMirror](http://marijn.haverbeke.nl/codemirror/) for its syntax highlighted in-browser CSS editor.

See [Installation](http://code.google.com/p/livestyle/wiki/Installation) for a quick install guide.


![http://www.equin.co.uk/images/livestyle.png](http://www.equin.co.uk/images/livestyle.png)