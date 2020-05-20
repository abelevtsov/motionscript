using Castle.Core.Logging;
using Nancy;
using OwnSpace.MotionScript.DataAccess.Contracts;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class IndexModule : NancyModule
    {
        public IndexModule(IScenarioRepository scenarioRepository)
        {
            ScenarioRepository = scenarioRepository;

            Get["/", runAsync: true] = 
                async (_, cts) =>
                {
                     var scenarios = await ScenarioRepository.ObtainScenarios().ConfigureAwait(false);
                     return View["index", scenarios];
                };

            Get["/create"] = _ => View["edit", string.Empty];

            Get["/edit/{id}"] = parameters => View["edit", parameters.id];
        }

        private IScenarioRepository ScenarioRepository { get; }

        private ILogger Logger { get; set; } = NullLogger.Instance;
    }
}
