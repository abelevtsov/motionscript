using System;
using System.Threading.Tasks;

using MongoDB.Bson;
using MongoDB.Driver;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.DataAccess
{
    public class ScenarioRepository : IScenarioRepository
    {
        public static Func<IMongoDatabase> GetDatabase { get; set; }

        public ScenarioRepository(string mongoConnectionString)
        {
            GetDatabase = () => new MongoClient(mongoConnectionString).GetDatabase("MotionScript");
        }

        public async Task<Scenario> ObtainScenario(ObjectId id)
        {
            var filter = Builders<Scenario>.Filter.Eq(it => it.Id, id);
            using (var cursor = await GetCollection().FindAsync(filter).ConfigureAwait(false))
            {
                while (await cursor.MoveNextAsync().ConfigureAwait(false))
                {
                    var batch = cursor.Current;
                    foreach (var scenario in batch)
                    {
                        return scenario;
                    }
                }
            }

            return null;
        }

        public async Task AddOrUpdateScenario(Scenario scenario)
        {
            await GetCollection().InsertOneAsync(scenario);
        }

        public void RemoveScenario(ObjectId id)
        {
            throw new NotImplementedException();
        }

        private static IMongoCollection<Scenario> GetCollection()
        {
            return GetCollection<Scenario>("Scenario");
        }

        private static IMongoCollection<T> GetCollection<T>(string name)
        {
            return GetDatabase().GetCollection<T>(name);
        }
    }
}
