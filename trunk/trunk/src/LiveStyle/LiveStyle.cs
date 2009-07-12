using System;
using System.IO;
using System.Reflection;
using System.Web;

namespace LiveStyle
{
    public class LiveStyleHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var liveStyleHandlerPath = context.Request.ApplicationPath.TrimEnd('/') + context.Request.AppRelativeCurrentExecutionFilePath.Substring(1);

            if (context.Request.Url.Query == "")
            {
                context.Response.Write(targetJs.Replace("$path", liveStyleHandlerPath));
                return;
            }
            if (context.Request.Url.Query == "?editor.js")
            {
                context.Response.Write(editorJs);
                return;
            }
            if (context.Request.Url.Query == "?editor.htm")
            {
                var html = editorHtmlTemplate.Replace("$js", liveStyleHandlerPath + "?editor.js");
                context.Response.Write(html);
                return;
            }
            if (context.Request.Url.Query == "?install")
            {
                context.Response.Write(installHtml.Replace("$path", liveStyleHandlerPath));
                return;
            }

            var cssFilename = context.Request.QueryString["file"];
            if (string.IsNullOrEmpty(cssFilename)) return;

            cssFilename = cssFilename.Substring(context.Request.ApplicationPath.TrimEnd('/').Length);

            var isPost = context.Request.HttpMethod.Equals("post", StringComparison.OrdinalIgnoreCase);

            if (isPost)
            {
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    var css = reader.ReadToEnd();
                    File.WriteAllText(context.Server.MapPath("~/" + cssFilename), css);
                }
            }
            else
            {
                context.Response.TransmitFile(context.Server.MapPath("~/" + cssFilename));
            }            
        }

        static readonly string editorHtmlTemplate;
        static readonly string targetJs;
        static readonly string editorJs;
        static readonly string installHtml;

        static LiveStyleHandler()
        {
            using (var reader = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("LiveStyle.editor.htm")))
                editorHtmlTemplate = reader.ReadToEnd();

            using (var reader = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("LiveStyle.target.js")))
                targetJs = reader.ReadToEnd();

            using (var reader = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("LiveStyle.editor.js")))
                editorJs = reader.ReadToEnd();

            using (var reader = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream("LiveStyle.install.htm")))
                installHtml = reader.ReadToEnd();
        }
    }
}
