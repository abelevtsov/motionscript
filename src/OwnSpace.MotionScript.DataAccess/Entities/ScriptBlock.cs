using MongoDB.Bson.Serialization.Attributes;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class ScriptBlock
    {
        public ScriptBlockType BlockType { get; set; }

        [BsonIgnoreIfNull]
        public string Text { get; set; }
    }
}
