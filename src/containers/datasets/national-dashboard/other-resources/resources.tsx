import WidgetControls from '@/components/widget-controls';

type ResourceTypes = {
  name: string;
  description: string;
  link: string;
};

const Resources = (resource: ResourceTypes) => {
  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <p className="leading-5">{resource.name}</p>
      <WidgetControls content={{ ...resource }} />
    </div>
  );
};

export default Resources;
