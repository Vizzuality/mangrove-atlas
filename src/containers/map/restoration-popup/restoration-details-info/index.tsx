import cn from 'lib/classnames';

const RestorationDetailsInfo = ({ data, isOpen, handleClick }) => {
  const { Class, Max_Area_20_ha, Area_loss_ha, Rest_Area_Loss, Loss_Driver, Rest_Score } = data;

  return (
    <div
      className={cn({
        'box-border flex w-full flex-col items-start p-6 font-sans': true,
        'max-h-[72px] w-full overflow-hidden': !isOpen,
      })}
    ></div>
  );
};

export default RestorationDetailsInfo;
