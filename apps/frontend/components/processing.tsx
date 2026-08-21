import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
export type ProcessingStage = "preparing" | "validating" | "simulating" | "ready";
const stages: ProcessingStage[]=["preparing","validating","simulating","ready"];
export function Processing({stage}:{stage:ProcessingStage}){const active=stages.indexOf(stage);return <div className="processing" role="status" aria-live="polite">{stages.map((item,index)=><div className={index<active?"done":index===active?"active":""} key={item}>{index<active?<CheckCircledIcon/>:<ReloadIcon/>}<span>{item[0].toUpperCase()+item.slice(1)}</span></div>)}</div>}
