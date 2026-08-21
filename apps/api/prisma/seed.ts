import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
  const launch=await prisma.launch.upsert({where:{slug:"solar-energy-alpha"},update:{},create:{slug:"solar-energy-alpha",name:"Solar Energy Alpha",description:"Demonstration renewable-energy capital launch.",category:"Renewable Energy",status:"LIVE",targetAmount:750000,settlementAsset:"USDC"}});
  console.log(`Seeded ${launch.name} (${launch.id})`);
}
main().finally(async()=>prisma.$disconnect());
