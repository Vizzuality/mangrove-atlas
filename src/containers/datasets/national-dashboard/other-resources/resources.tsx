import WidgetControls from 'components/widget-controls';

type ResourcesTypes = {
  name: string;
  description: string;
  link: string;
};

const Resources = (resource: ResourcesTypes) => {
  return (
    <div className="flex flex-1 items-start justify-between">
      {<p>{resource.name}</p>}
      <WidgetControls content={{ ...resource }} />
    </div>
  );
};

export default Resources;
