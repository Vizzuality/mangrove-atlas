export default function VideoIntro() {
  return (
    <video
      width="100%"
      height="100%"
      autoPlay
      loop
      preload="none"
      muted
      playsInline
      className="absolute left-0 right-0 top-0 h-full w-full rounded-3xl object-fill"
    >
      <source src="/help-intro.mov" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
