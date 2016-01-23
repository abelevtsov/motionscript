using Nancy;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get["/"] = 
                _ =>
                {
                    return View["index"];
                };
        }
    }
}
