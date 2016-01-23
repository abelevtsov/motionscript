using Castle.Core.Logging;
using Nancy;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class IndexModule : NancyModule
    {
        private ILogger logger = NullLogger.Instance;

        public IndexModule()
        {
            Get["/"] = 
                _ =>
                {
                    return View["index"];
                };
        }

        public ILogger Logger
        {
            get { return logger; }
            set { logger = value; }
        }
    }
}
