using System.Threading.Tasks;

using MongoDB.Bson;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.DataAccess.Contracts
{
    public interface IScenarioRepository
    {
        Task<Scenario> ObtainScenario(ObjectId id);

        Task AddOrUpdateScenario(Scenario scenario);

        void RemoveScenario(ObjectId id);
    }
}
