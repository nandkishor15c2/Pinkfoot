import { Link } from "react-router-dom";
import { Icon, Luggage } from "../components/icons/index.jsx";

export default function NotFoundPage() {
  return (
    <main className="container-page pt-32 pb-20 text-center">
      <div className="mx-auto inline-block text-[var(--color-pink)]">
        <Icon size={80} animate><Luggage /></Icon>
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold text-[var(--color-navy)]">
        Looks like this path doesn't lead anywhere.
      </h1>
      <p className="mt-3 text-gray-500">
        The page you were looking for has packed its bags. Try one of these instead:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Home</Link>
        <Link to="/search" className="btn-outline">Browse Packages</Link>
      </div>
    </main>
  );
}
