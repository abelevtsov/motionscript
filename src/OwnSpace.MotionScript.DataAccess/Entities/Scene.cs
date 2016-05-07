using System.Collections.Generic;
using System.Linq;

using MongoDB.Bson.Serialization.Attributes;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Scene
    {
        public Scene()
        {
            Blocks = new List<ScriptBlock>();
        }

        [BsonIgnoreIfNull]
        public string Heading
        {
            get
            {
                return Blocks.Any() ? Blocks.First().Text : string.Empty;
            }
        }

        public IList<ScriptBlock> Blocks { get; set; }
    }
}
