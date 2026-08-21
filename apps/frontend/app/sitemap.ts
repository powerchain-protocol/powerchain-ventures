import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
export default function sitemap():MetadataRoute.Sitemap{const routes=["","/about","/products","/renewables","/pricing","/partners","/legal","/legal/privacy","/legal/terms","/legal/risk-disclosure"];return routes.map(path=>({url:`${SITE.urls.frontend}${path}`,changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.6}))}
