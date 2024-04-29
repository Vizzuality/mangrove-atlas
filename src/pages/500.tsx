export default function Custom500({ statusCode }) {
  return (
    <h1 className="h-screen w-screen text-black">500 - Server-side error occurred {statusCode}</h1>
  );
}
