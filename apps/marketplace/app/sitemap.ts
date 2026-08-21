import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
export default function sitemap():MetadataRoute.Sitemap{const routes=["","/about","/legal","/legal/privacy","/legal/terms","/legal/risk-disclosure"];return routes.map(path=>({url:`${SITE.urls.marketplace}${path}`,changeFrequency:path===""?"daily":"monthly",priority:path===""?1:.5}))}
