import { useEffect, useState } from "react";
import { api, safe } from "./api.js";
import { destinations as mockDestinations } from "../data/destinations.js";
import { packages as mockPackages } from "../data/packages.js";
import { reviews as mockReviews } from "../data/reviews.js";

/** Returns {data, loading, error, source} — falls back to local mock data if API is down */
export function useDestinations() {
  const [s, setS] = useState({ data: null, loading: true, error: null, source: "loading" });
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await safe(api.destinations(), null);
      if (!alive) return;
      if (data && data.length) setS({ data, loading: false, error: null, source: "api" });
      else setS({ data: mockDestinations, loading: false, error: null, source: "mock" });
    })();
    return () => { alive = false; };
  }, []);
  return s;
}

export function useDestination(slug) {
  const [s, setS] = useState({ data: null, loading: true });
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await safe(api.destination(slug), null);
      if (!alive) return;
      if (data) setS({ data, loading: false, source: "api" });
      else setS({ data: mockDestinations.find((d) => d.slug === slug) || null, loading: false, source: "mock" });
    })();
    return () => { alive = false; };
  }, [slug]);
  return s;
}

export function usePackages(params = {}) {
  const key = JSON.stringify(params);
  const [s, setS] = useState({ data: null, loading: true, source: "loading" });
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await safe(api.packages(params), null);
      if (!alive) return;
      if (data && data.length) setS({ data, loading: false, source: "api" });
      else setS({ data: mockPackages, loading: false, source: "mock" });
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return s;
}

export function usePackage(slug) {
  const [s, setS] = useState({ data: null, loading: true });
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await safe(api.package(slug), null);
      if (!alive) return;
      if (data) setS({ data, loading: false, source: "api" });
      else setS({ data: mockPackages.find((p) => p.slug === slug) || null, loading: false, source: "mock" });
    })();
    return () => { alive = false; };
  }, [slug]);
  return s;
}

export function useReviews(packageSlug) {
  const [s, setS] = useState({ data: [], loading: true });
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await safe(api.reviews(packageSlug), null);
      if (!alive) return;
      if (data && data.length) setS({ data, loading: false, source: "api" });
      else
        setS({
          data: packageSlug
            ? mockReviews.filter((r) => r.packageSlug === packageSlug)
            : mockReviews,
          loading: false,
          source: "mock",
        });
    })();
    return () => { alive = false; };
  }, [packageSlug]);
  return s;
}
