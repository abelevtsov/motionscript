﻿using Castle.Core.Logging;
using MongoDB.Bson;
using Nancy;
using Nancy.ModelBinding;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class IndexModule : NancyModule
    {
        private ILogger logger = NullLogger.Instance;

        private IScenarioRepository ScenarioRepository { get; set; }

        public IndexModule(IScenarioRepository scenarioRepository)
        {
            ScenarioRepository = scenarioRepository;

            Get["/"] =
                _ =>
                {
                    return View["index"];
                };
            Get["/scenario/{id}", runAsync: true] =
                async (@params, cts) =>
                {
                    var scenario = await ScenarioRepository.ObtainScenario(ObjectId.Parse((string)@params.id)).ConfigureAwait(false);
                    return Response.AsJson(scenario);
                };
            Post["/scenario", runAsync: true] =
                async (_, cts) =>
                {
                    var scenario = this.Bind<Scenario>();
                    await ScenarioRepository.AddOrUpdateScenario(scenario);

                    return View["index"];
                };
        }

        private ILogger Logger
        {
            get { return logger; }
            set { logger = value; }
        }
    }
}
