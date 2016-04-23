using Castle.Core.Logging;
using Nancy;
using Nancy.ModelBinding;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class IndexModule : NancyModule
    {
        private ILogger logger = NullLogger.Instance;

        public IndexModule(IScenarioRepository scenarioRepository)
        {
            ScenarioRepository = scenarioRepository;

            Get["/"] = _ => View["index"];
            Get["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenarios = await ScenarioRepository.ObtainScenarios().ConfigureAwait(false);
                    return Response.AsJson(scenarios);
                };
            Get["/scenario/{id:long}", runAsync: true] =
                async (parameters, cts) =>
                {
                    var scenario = await ScenarioRepository.ObtainScenario(parameters.id).ConfigureAwait(false) as Scenario;
                    return scenario == null ? null : Response.AsJson(scenario);
                };
            Post["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();
                    await ScenarioRepository.AddOrUpdateScenario(scenario).ConfigureAwait(false);

                    return View["index"];
                };
            Put["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();
                    var sc = await ScenarioRepository.ObtainScenario(scenario.Id).ConfigureAwait(false);
                    sc.Name = scenario.Name;
                    await ScenarioRepository.AddOrUpdateScenario(sc).ConfigureAwait(false);

                    return View["index"];
                };
            Delete["/scenario/{id:long}", runAsync: true] =
                async (parameters, cts) =>
                {
                    await ScenarioRepository.RemoveScenario(parameters.id).ConfigureAwait(false);

                    return View["index"];
                };
        }

        private IScenarioRepository ScenarioRepository { get; set; }

        private ILogger Logger
        {
            get { return logger; }
            set { logger = value; }
        }
    }
}
