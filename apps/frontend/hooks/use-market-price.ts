"use client";
import { useEffect, useState } from "react";
import type { MarketPriceResult } from "@powerchain/types";
import { createPowerChainApi } from "@powerchain/api-client";
import { SITE } from "@/constants/site";

const api=createPowerChainApi({baseUrl:SITE.urls.api});
function socketUrl(){try{const url=new URL(SITE.urls.api);url.protocol=url.protocol==="https:"?"wss:":"ws:";url.pathname="/api/v1/ws";url.search="";return url.toString()}catch{return ""}}
export function useMarketPrice(symbol="SOL"){
  const [data,setData]=useState<MarketPriceResult|null>(null);const [transport,setTransport]=useState<"websocket"|"rest">("rest");
  useEffect(()=>{let active=true;let socket:WebSocket|undefined;let timer:ReturnType<typeof setInterval>|undefined;async function poll(){try{const next=await api.getMarketPrice(symbol);if(active)setData(next)}catch{}}void poll();timer=setInterval(()=>void poll(),30_000);const url=socketUrl();if(url){try{socket=new WebSocket(url);socket.addEventListener("open",()=>{setTransport("websocket");socket?.send(JSON.stringify({type:"subscribe",channels:[`market:${symbol.toUpperCase()}`]}))});socket.addEventListener("message",(event)=>{try{const message=JSON.parse(String(event.data)) as {type?:string;data?:MarketPriceResult};if(message.type==="market.price"&&message.data&&active)setData(message.data)}catch{}});socket.addEventListener("close",()=>setTransport("rest"));socket.addEventListener("error",()=>setTransport("rest"))}catch{setTransport("rest")}}return()=>{active=false;if(timer)clearInterval(timer);socket?.close()}},[symbol]);
  return {data,transport};
}
