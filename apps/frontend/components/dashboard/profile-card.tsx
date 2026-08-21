"use client";
import { FormEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";
import { SITE } from "@/constants/site";

export function ProfileCard(){const {user}=useAuth();const [name,setName]=useState(user?.name||"");const [image,setImage]=useState(user?.image||"");const [message,setMessage]=useState("");async function submit(e:FormEvent){e.preventDefault();setMessage("");const response=await fetch(`${SITE.urls.api}/api/v1/account/profile`,{method:"PATCH",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify({name,image:image||null})});const payload=await response.json() as {error?:{message?:string}};setMessage(response.ok?"Profile updated. Refreshing the session may be required before every surface reflects the change.":payload.error?.message||"Unable to update profile.")}const initials=(user?.name||user?.email||"PC").split(/\s+/).map((part)=>part[0]).join("").slice(0,2).toUpperCase();return <form className="settings-card" onSubmit={submit}><div className="profile-identity"><Avatar><AvatarImage src={image||undefined} alt=""/><AvatarFallback>{initials}</AvatarFallback></Avatar><div><h2>Profile</h2><p>{user?.email}</p></div></div><FormField><FormLabel htmlFor="display-name">Display name</FormLabel><Input id="display-name" value={name} onChange={(e)=>setName(e.target.value)} required/></FormField><FormField><FormLabel htmlFor="avatar-url">Avatar URL</FormLabel><Input id="avatar-url" type="url" value={image} onChange={(e)=>setImage(e.target.value)} placeholder="https://…"/></FormField>{message?<FormMessage className={message.startsWith("Profile updated")?"form-success":""}>{message}</FormMessage>:null}<Button type="submit">Save profile</Button></form>}
