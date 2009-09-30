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
            var resourceName = context.Request.QueryString["resource"];
            var cssFilename = context.Request.QueryString["file"];

            if (resourceName != null)
            {
                OutputResource(context, resourceName);
            }
            else if (cssFilename != null)
            {
                ProcessCssRequest(context, cssFilename);
            }
            else
            {
                OutputResource(context, "install.htm");
            }
        }

        static void ProcessCssRequest(HttpContext context, string cssFilename)
        {
            cssFilename = cssFilename.Substring(context.Request.ApplicationPath.TrimEnd('/').Length);

            if (IsPost(context))
            {
                SaveCssFile(context, cssFilename);
            }
            else
            {
                OutputCssFile(context, cssFilename);
            }
        }

        static bool IsPost(HttpContext context)
        {
            return context.Request.HttpMethod.Equals("post", StringComparison.OrdinalIgnoreCase);
        }

        static void SaveCssFile(HttpContext context, string cssFilename)
        {
            using (var reader = new StreamReader(context.Request.InputStream))
            {
                var css = reader.ReadToEnd();
                File.WriteAllText(context.Server.MapPath("~/" + cssFilename), css);
            }
        }

        static void OutputCssFile(HttpContext context, string cssFilename)
        {
            var filename = context.Server.MapPath("~/" + cssFilename);
            if (File.Exists(filename))
            {
                context.Response.TransmitFile(filename);
            }
            else
            {
                NotFound(context);
            }
        }

        static void NotFound(HttpContext context)
        {
            context.Response.StatusCode = 404;
        }

        static void OutputResource(HttpContext context, string resourceName)
        {
            var liveStyleHandlerPath = context.Request.ApplicationPath.TrimEnd('/') + context.Request.AppRelativeCurrentExecutionFilePath.Substring(1);
            resourceName = "LiveStyle." + resourceName.Replace('/', '.');
            try
            {
                var resource = ReadResource(resourceName);
                resource = ReplacePathPlaceholder(resourceName, resource, liveStyleHandlerPath);
                SetContentType(context, resourceName);
                context.Response.Write(resource);
            }
            catch
            {
                NotFound(context);
            }
        }

        static string ReplacePathPlaceholder(string resourceName, string resource, string liveStyleHandlerPath)
        {
            if (resourceName == "LiveStyle.target.js"
             || resourceName == "LiveStyle.install.htm"
             || resourceName == "LiveStyle.editor.htm"
             || resourceName == "LiveStyle.editor.js")
            {
                resource = resource.Replace("$path", liveStyleHandlerPath);
            }
            return resource;
        }

        static string ReadResource(string resourceName)
        {
            using (var reader = new StreamReader(Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)))
                return reader.ReadToEnd();
        }

        static void SetContentType(HttpContext context, string resourceName)
        {
            if (resourceName.EndsWith(".htm", StringComparison.OrdinalIgnoreCase))
                context.Response.ContentType = "text/html";

            else if (resourceName.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
                context.Response.ContentType = "text/javascript";

            else if (resourceName.EndsWith(".css", StringComparison.OrdinalIgnoreCase))
                context.Response.ContentType = "text/css";
        }
    }
}
