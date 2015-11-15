  1. Add a reference to the LiveStyle DLL from your ASP.NET web project.
  1. Add this handler to your web.config `<add verb="*" path="LiveStyle.ashx" type="LiveStyle.LiveStyleHandler, LiveStyle"/>`
  1. Run your web site
  1. Navigate to `/livestyle.ashx`
  1. Add the Live Style bookmarklet to your favorites/bookmarks (using the right click menu usually)

## Starting LiveStyle ##
When on a page of your website, run the bookmarklet. This injects a script into your page and opens the Live Style editor window.

You will probably need to disable your pop-up blocker temporarily.

Alternatively, run `LiveStyle.open()` from your JavaScript console.

## Security ##

To stop anonymous access to LiveStyle, either remove it from your production web.config, or add:
```
  <location path="~/livestyle.ashx">
    <system.web>
      <authorization>
        <deny users="?"/>
      </authorization>
    </system.web>
  </location>
```