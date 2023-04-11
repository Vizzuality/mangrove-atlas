import * as RadioGroup from '@radix-ui/react-radio-group';

const RadioGroupDemo = () => (
  <form>
    <RadioGroup.Root className="flex flex-col gap-4" defaultValue="default" aria-label="">
      <div className="flex items-center">
        <RadioGroup.Item
          className="h-4 w-4 rounded-full border-2 border-brand-800/20 bg-white data-[state=checked]:border-brand-800"
          value="default"
          id="r1"
        >
          <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-brand-800 after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-2.5 text-base text-black" htmlFor="r1">
          Default
        </label>
      </div>
      <div className="flex items-center">
        <RadioGroup.Item
          className="h-4 w-4 rounded-full border-2 border-brand-800/20 bg-white data-[state=checked]:border-brand-800"
          value="comfortable"
          id="r2"
        >
          <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-brand-800 after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-2.5 text-base text-black" htmlFor="r2">
          Comfortable
        </label>
      </div>
      <div className="flex items-center">
        <RadioGroup.Item
          className="h-4 w-4 rounded-full border-2 border-brand-800/20 bg-white data-[state=checked]:border-brand-800"
          value="compact"
          id="r3"
        >
          <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-brand-800 after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-2.5 text-base text-black" htmlFor="r3">
          Compact
        </label>
      </div>
    </RadioGroup.Root>
  </form>
);

export default RadioGroupDemo;
