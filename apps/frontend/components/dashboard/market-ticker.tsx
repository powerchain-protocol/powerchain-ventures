"use client";
import { Badge } from "@/components/ui/badge";
import { useMarketPrice } from "@/hooks/use-market-price";
export function MarketTicker(){const {data,transport}=useMarketPrice("SOL");return <div className="market-ticker"><div><span>SOL / USD</span><strong>{data?`$${data.price.usd.toLocaleString(undefined,{maximumFractionDigits:2})}`:"—"}</strong></div><div><Badge variant="outline">{data?.price.source||"loading"}</Badge><small>{data?.fallbackUsed?"Fallback source active":"Primary source"}</small></div><div><Badge variant={transport==="websocket"?"success":"secondary"}>{transport}</Badge><small>{data?.price.stale?"Price may be stale":"Live market data"}</small></div></div>}
