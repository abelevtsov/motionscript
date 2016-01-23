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
                    Logger.Info("APP STARTED");
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
