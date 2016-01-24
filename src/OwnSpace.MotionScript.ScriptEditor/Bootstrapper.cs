using Castle.Facilities.Logging;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Nancy.Bootstrappers.Windsor;
using OwnSpace.MotionScript.DataAccess;
using OwnSpace.MotionScript.DataAccess.Contracts;
using OwnSpace.MotionScript.ScriptEditor.Properties;

namespace OwnSpace.MotionScript.ScriptEditor
{
    public class Bootstrapper : WindsorNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(IWindsorContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register(Component.For(typeof(IScenarioRepository))
                     .ImplementedBy(typeof(ScenarioRepository))
                     .LifeStyle.Transient
                     .DependsOn(Dependency.OnValue("mongoConnectionString", Settings.Default.MongoConnectionString)))
                     .AddFacility<LoggingFacility>(f => f.LogUsing(LoggerImplementation.NLog).WithConfig("NLog.config"));
        }
    }
}
