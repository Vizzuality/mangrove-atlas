import * as RadioGroup from '@radix-ui/react-radio-group';

interface Option {
  id: string;
  label: string;
}

const RadioGroupDemo = ({ options }: { options: Option[] }) => {
  return (
    <form>
      <RadioGroup.Root className="flex flex-col gap-4" defaultValue="default" aria-label="">
        {options.map((o) => {
          return (
            <div key={`radio-item-${o}`} className="flex items-center">
              <RadioGroup.Item
                className="h-4 w-4 rounded-full border-2 border-brand-800/20 bg-white data-[state=checked]:border-brand-800"
                value={o}
                id={o}
              >
                <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-brand-800 after:content-['']" />
              </RadioGroup.Item>
              <label className="pl-2.5 text-base text-black" htmlFor={o}>
                {o}
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>
    </form>
  );
};

export default RadioGroupDemo;
