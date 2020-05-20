using System.Collections.Generic;
using System.Linq;

using MongoDB.Bson.Serialization.Attributes;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Scene
    {
        [BsonIgnoreIfNull]
        public string Heading => Blocks.Any() ? Blocks.First().Text : string.Empty;

        public IEnumerable<ScriptBlock> Blocks { get; } = new List<ScriptBlock>();
    }
}
