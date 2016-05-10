using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using MongoDB.Bson;
using MongoDB.Driver;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.DataAccess.Entities;

namespace OwnSpace.MotionScript.DataAccess
{
    public class ScenarioRepository : IScenarioRepository
    {
        public ScenarioRepository(string mongoConnectionString)
        {
            GetDatabase = () => new MongoClient(mongoConnectionString).GetDatabase("MotionScript");
        }

        private static Func<IMongoDatabase> GetDatabase { get; set; }

        public async Task<IEnumerable<Scenario>> ObtainScenarios()
        {
            var result = new List<Scenario>();
            var filter = Builders<Scenario>.Filter.Empty;
            using (var cursor = await GetCollection().FindAsync(filter).ConfigureAwait(false))
            {
                while (await cursor.MoveNextAsync().ConfigureAwait(false))
                {
                    result.AddRange(cursor.Current);
                }
            }

            return result;
        }

        public async Task<Scenario> ObtainScenario(ObjectId id)
        {
            var filter = Builders<Scenario>.Filter.Eq(it => it.Id, id.ToString());
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

        public async Task<Scenario> AddOrUpdateScenario(Scenario scenario)
        {
            var collection = GetCollection();
            if (string.IsNullOrEmpty(scenario.Id))
            {
                scenario.Id = ObjectId.GenerateNewId(DateTime.UtcNow).ToString();
                await collection.InsertOneAsync(scenario).ConfigureAwait(false);
                var result = await collection.FindAsync(it => it.Id == scenario.Id).ConfigureAwait(false);
                return await result.FirstAsync().ConfigureAwait(false);
            }

            await collection
                .ReplaceOneAsync(
                    it => it.Id == scenario.Id,
                    scenario,
                    new UpdateOptions
                        {
                            IsUpsert = true
                        })
                .ConfigureAwait(false);

            return scenario;
        }

        public async Task RemoveScenario(ObjectId id)
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
