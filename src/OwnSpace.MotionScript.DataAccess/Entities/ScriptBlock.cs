using MongoDB.Bson;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class ScriptBlock
    {
        public ObjectId Id { get; set; }

        public ScriptBlockType BlockType { get; set; }

        public string Text { get; set; }
    }
}
