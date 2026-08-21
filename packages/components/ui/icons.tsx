import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function PowerBoltIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M13.5 2 5 13h6l-.5 9L19 10h-6l.5-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}

export function NetworkGlobeIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3.7 12h16.6M12 3.5c2.3 2.2 3.5 5 3.5 8.5S14.3 18.3 12 20.5C9.7 18.3 8.5 15.5 8.5 12S9.7 5.7 12 3.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function LeafEnergyIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M19.5 4.5C11 4.7 5.8 8.7 5.8 14c0 3.3 2.4 5.5 5.5 5.5 5.8 0 8.2-6.2 8.2-15Z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c3.2-5.5 7-8.7 12.5-11.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export { AlarmIcon } from "./alarms";
export { BellIcon } from "./bells";
export { InformationIcon } from "./information";
