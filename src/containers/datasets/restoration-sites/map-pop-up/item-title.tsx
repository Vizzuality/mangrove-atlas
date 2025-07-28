import cn from 'lib/classnames';

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
        'text-left text-sm font-semibold text-brand-800': true,
        'text-gray-400': disabled,
      })}
    >
      {title}
    </span>
  );
};

export default PopupRestorationSitesItemTitle;
