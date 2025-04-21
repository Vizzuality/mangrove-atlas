import WidgetControls from 'components/widget-controls';

type OtherResourcesTypes = {
  name: string;
  description: string;
  link: string;
};

const OtherResources = (resource: OtherResourcesTypes) => {
  return (
    <div className="flex flex-1 items-start justify-between">
      {<p>{resource.name}</p>}
      <WidgetControls content={{ ...resource }} />
    </div>
  );
};

export default OtherResources;
