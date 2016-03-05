using System.Collections.Generic;

using MongoDB.Bson;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Scene
    {
        public Scene()
        {
            Blocks = new List<ScriptBlock>();
        }

        public ObjectId Id { get; set; }

        public string Heading { get; set; }

        public IList<ScriptBlock> Blocks { get; set; }
    }
}
