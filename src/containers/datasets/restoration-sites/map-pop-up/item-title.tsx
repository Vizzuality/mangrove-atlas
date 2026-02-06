import cn from '@/lib/classnames';

const PopupRestorationSitesItemTitle = ({
  title,
  disabled,
}: {
  title: string;
  disabled?: boolean;
}) => {
  return (
    <span
      className={cn({
        'text-brand-800 text-left text-sm font-semibold': true,
        'text-gray-400': disabled,
      })}
    >
      {title}
    </span>
  );
};

export default PopupRestorationSitesItemTitle;
