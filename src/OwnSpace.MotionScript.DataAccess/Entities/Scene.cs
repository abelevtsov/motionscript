using System.Collections.Generic;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Scene
    {
        public Scene()
        {
            SceneBlocks = new List<ScriptBlock>();
        }

        public int Id { get; set; }

        public string Heading { get; set; }

        public IList<ScriptBlock> SceneBlocks { get; private set; }
    }
}
