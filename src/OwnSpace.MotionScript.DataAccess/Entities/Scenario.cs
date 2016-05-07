using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Scenario
    {
        public Scenario()
        {
            Scenes = new List<Scene>();
        }

        public ObjectId Id { get; set; }

        public Author Author { get; set; }

        [BsonIgnoreIfNull]
        public string Name { get; set; }

        [BsonIgnoreIfNull]
        [BsonDefaultValue(1)]
        public string Version { get; set; }

        public IList<Scene> Scenes { get; set; }
    }
}
