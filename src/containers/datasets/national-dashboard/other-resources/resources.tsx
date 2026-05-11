import WidgetControls from '@/components/widget-controls';

type ResourceTypes = {
  name: string;
  description: string;
  link: string;
};

const Resources = (resource: ResourceTypes) => {
  return (
    <div className="flex flex-1 items-start justify-between">
      {<p>{resource.name}</p>}
      <WidgetControls content={{ ...resource }} />
    </div>
  );
};

export default Resources;
