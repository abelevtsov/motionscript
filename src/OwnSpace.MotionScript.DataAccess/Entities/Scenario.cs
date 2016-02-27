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

        public Scenario(string name) : this()
        {
            Name = name;
        }

        public ObjectId Id { get; set; }

        public Author Author { get; set; }

        public string Name { get; private set; }

        public string Version { get; set; }

        public IList<Scene> Scenes { get; private set; }
    }
}
