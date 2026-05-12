import { useEffect } from "react";

function setMeta(name, content, attr = "name") {
  if (!content) return null;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("content");
  el.setAttribute("content", content);
  return () => {
    if (created) el.remove();
    else if (prev != null) el.setAttribute("content", prev);
  };
}

/** Set <title> + meta description/keywords + Open Graph for the current page. */
export function useSEO({ title, description, keywords, image, url } = {}) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;
    const cleanups = [
      setMeta("description", description),
      setMeta("keywords", keywords),
      setMeta("og:title", title || prevTitle, "property"),
      setMeta("og:description", description, "property"),
      setMeta("og:image", image, "property"),
      setMeta("og:url", url || window.location.href, "property"),
      setMeta("twitter:card", "summary_large_image"),
      setMeta("twitter:title", title || prevTitle),
      setMeta("twitter:description", description),
      setMeta("twitter:image", image),
    ];
    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn && fn());
    };
  }, [title, description, keywords, image, url]);
}
