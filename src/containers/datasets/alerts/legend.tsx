const Legend = () => {
  return (
    <div className="flex items-center justify-start pt-6 text-sm">
      <span
        style={{
          background: 'linear-gradient(180deg, #C72BD6 0%, #EB4444 52.39%, #FFC200 100%)',
        }}
        className="mr-2.5 flex h-4 w-2 shrink-0 rounded-md"
      />
      <p className="text-start font-bold">Alerts</p>
    </div>
  );
};

export default Legend;
