import * as Switch from '@radix-ui/react-switch';

const SwitchDemo = () => (
  <form>
    <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
      <label className="pr-[15px] text-[15px] leading-none text-white" htmlFor="airplane-mode">
        Airplane mode
      </label>
      <Switch.Root
        className="border-teal-0 data-[state=checked]:bg-teal-0 relative h-7 w-12 cursor-default rounded-full border-2 border-opacity-20 outline-none"
        id="airplane-mode"
      >
        <Switch.Thumb className="bg-teal-0 block h-5 w-5 translate-x-0.5 rounded-full transition-transform will-change-transform duration-100 data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  </form>
);

export default SwitchDemo;
