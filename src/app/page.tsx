export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg mb-8">
          This is my personal website. Content coming soon...
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-primary">View Projects</button>
          <button className="btn btn-outline">About Me</button>
        </div>
      </div>
    </div>
  );
}
