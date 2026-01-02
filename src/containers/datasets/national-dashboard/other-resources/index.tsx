import cn from 'classnames';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import Resources from './resources';

export const OtherResources = ({
  resources,
}: {
  resources: Array<{ name: string; description: string; link: string }>;
}) => (
  <>
    <div className="absolute left-4 right-4 h-0.5 bg-brand-800/30" />
    <section className="space-y-2 py-[25px] text-sm">
      <h3 className={cn({ [WIDGET_SUBTITLE_STYLE]: true, 'py-2 font-normal': true })}>
        OTHER RESOURCES
      </h3>
      {resources.map((resource) => (
        <Resources key={resource.link} {...resource} />
      ))}
    </section>
  </>
);

export default OtherResources;
