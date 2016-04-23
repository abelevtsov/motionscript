using System.Collections.Generic;
using System.Threading.Tasks;

using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.DataAccess.Contracts
{
    public interface IScenarioRepository
    {
        Task<IEnumerable<Scenario>> ObtainScenarios();

        Task<Scenario> ObtainScenario(long id);

        Task AddOrUpdateScenario(Scenario scenario);

        Task RemoveScenario(long id);
    }
}
