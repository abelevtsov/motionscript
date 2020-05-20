using MongoDB.Bson;
using Nancy;
using Nancy.ModelBinding;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.ScriptEditor
{
    // ReSharper disable once UnusedType.Global
    public sealed class ScenarioModule : NancyModule
    {
        public ScenarioModule(IScenarioRepository scenarioRepository) : base("/scenario")
        {
            ScenarioRepository = scenarioRepository;

            Get(
                "/{id}",
                async (parameters, cts) =>
                {
                    var id = ObjectId.Parse((string)parameters.id);
                    var scenario = await ScenarioRepository.ObtainScenario(id).ConfigureAwait(false);
                    return Response.AsJson(scenario);
                });

            Post(
                "/",
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();

                    // ToDo: return only Id
                    var result = await ScenarioRepository.AddOrUpdateScenario(scenario).ConfigureAwait(false);

                    return Response.AsJson(result);
                });

            Put(
                "/",
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();
                    var result = await ScenarioRepository.AddOrUpdateScenario(scenario).ConfigureAwait(false);

                    return Response.AsJson(result);
                });

            Delete(
                "/{id}",
                async (parameters, cts) =>
                {
                    var id = ObjectId.Parse((string)parameters.id);
                    await ScenarioRepository.RemoveScenario(id).ConfigureAwait(false);

                    return Response.AsRedirect("/");
                });
        }

        private IScenarioRepository ScenarioRepository { get; }
    }
}
