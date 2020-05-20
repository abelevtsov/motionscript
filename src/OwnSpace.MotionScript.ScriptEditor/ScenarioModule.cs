using Castle.Core.Logging;
using MongoDB.Bson;
using Nancy;
using Nancy.ModelBinding;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class ScenarioModule : NancyModule
    {
        public ScenarioModule(IScenarioRepository scenarioRepository)
        {
            ScenarioRepository = scenarioRepository;

            Get["/scenario/{id}", runAsync: true] =
                async (parameters, cts) =>
                {
                    var id = ObjectId.Parse((string)parameters.id);
                    var scenario = await ScenarioRepository.ObtainScenario(id).ConfigureAwait(false);
                    return Response.AsJson(scenario);
                };

            Post["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();

                    // ToDo: return only Id
                    var result = await ScenarioRepository.AddOrUpdateScenario(scenario).ConfigureAwait(false);

                    return Response.AsJson(result);
                };

            Put["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();
                    var result = await ScenarioRepository.AddOrUpdateScenario(scenario).ConfigureAwait(false);

                    return Response.AsJson(result);
                };

            Delete["/scenario/{id}", runAsync: true] =
                async (parameters, cts) =>
                {
                    var id = ObjectId.Parse((string)parameters.id);
                    await ScenarioRepository.RemoveScenario(id).ConfigureAwait(false);

                    return Response.AsRedirect("/");
                };
        }

        private IScenarioRepository ScenarioRepository { get; }

        private ILogger Logger { get; set; } = NullLogger.Instance;
    }
}
