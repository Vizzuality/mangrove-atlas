import PopupRestorationSitesItemTitle from './item-title';
import PopupRestorationSitesItemInfo from './item-info';

const PopupRestorationSitesSingleItem = ({ title, info }: { title: string; info: string }) => (
  <div className="flex flex-col">
    <PopupRestorationSitesItemTitle title={title} disabled={!info.length} />
    {!!info.length && <PopupRestorationSitesItemInfo info={info} />}
  </div>
);

export default PopupRestorationSitesSingleItem;
