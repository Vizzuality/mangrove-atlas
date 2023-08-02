import WidgetControls from 'components/widget-controls';

type OtherResourcesTypes = {
  name: string;
  description: string;
  link: string;
};

const OtherResources = ({ name, description, link }: OtherResourcesTypes) => (
  <div className="flex flex-1 items-start justify-between">
    {<p>{name}</p>}

    <WidgetControls
      content={{
        download: link,
        info: description,
      }}
    />
  </div>
);

export default OtherResources;
