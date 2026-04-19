import { useEffect, useMemo } from "react";

export type SEOMeta = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: unknown;
  jsonLdId?: string;
};

function upsertMeta(selector: string, attr: "name" | "property", attrVal: string, content?: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageSEO(meta: SEOMeta) {
  const jsonLdString = useMemo(
    () => (meta.jsonLd ? JSON.stringify(meta.jsonLd) : ""),
    [meta.jsonLd]
  );

  useEffect(() => {
    if (!meta.title && !meta.description && !jsonLdString) return;

    const prevTitle = document.title;
    if (meta.title) document.title = meta.title;

    upsertMeta('meta[name="description"]', "name", "description", meta.description);
    upsertMeta('meta[name="keywords"]', "name", "keywords", meta.keywords);
    upsertMeta('meta[name="author"]', "name", "author", "Mahmood Salah");
    upsertMeta('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");

    upsertMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", meta.ogType || "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", meta.canonicalUrl);
    upsertMeta('meta[property="og:image"]', "property", "og:image", meta.ogImage);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Mahmood Salah");
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", "en_US");

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", meta.ogImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical && !!meta.canonicalUrl;
    if (meta.canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = meta.canonicalUrl;
    }

    const id = meta.jsonLdId || "page-jsonld";
    let ld: HTMLScriptElement | null = null;
    if (jsonLdString) {
      ld = document.getElementById(id) as HTMLScriptElement | null;
      if (!ld) {
        ld = document.createElement("script");
        ld.id = id;
        ld.type = "application/ld+json";
        document.head.appendChild(ld);
      }
      ld.text = jsonLdString;
    }

    return () => {
      document.title = prevTitle;
      if (ld) ld.remove();
      if (createdCanonical && canonical) canonical.remove();
    };
  }, [meta.title, meta.description, meta.keywords, meta.canonicalUrl, meta.ogImage, meta.ogType, meta.jsonLdId, jsonLdString]);
}
