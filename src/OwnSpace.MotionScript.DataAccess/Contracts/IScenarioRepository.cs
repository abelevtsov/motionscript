﻿using System.Collections.Generic;
using System.Threading.Tasks;

using MongoDB.Bson;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.DataAccess.Contracts
{
    public interface IScenarioRepository
    {
        Task<IEnumerable<Scenario>> ObtainScenarios();

        Task<Scenario> ObtainScenario(ObjectId id);

        Task<Scenario> AddOrUpdateScenario(Scenario scenario);

        Task RemoveScenario(ObjectId id);
    }
}
