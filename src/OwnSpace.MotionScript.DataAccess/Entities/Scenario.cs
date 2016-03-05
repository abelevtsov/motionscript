using System.Collections.Generic;

using MongoDB.Bson;

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

        public string Name { get; set; }

        public string Version { get; set; }

        public IList<Scene> Scenes { get; set; }
    }
}
