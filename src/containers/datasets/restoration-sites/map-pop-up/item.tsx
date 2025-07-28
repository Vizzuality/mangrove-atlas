import PopupRestorationSitesSingleItem from './single-item';
import PopupRestorationSitesCollapsibleItem from './collapsible-item';

const PopupRestorationSitesItem = ({ title, info }: { title: string; info: string | string[] }) => (
  <div className="flex w-full flex-col items-start">
    {info.length <= 1 && <PopupRestorationSitesSingleItem title={title} info={info as string} />}
    {info.length > 1 && (
      <PopupRestorationSitesCollapsibleItem title={title} info={info as string[]} />
    )}
  </div>
);

export default PopupRestorationSitesItem;
