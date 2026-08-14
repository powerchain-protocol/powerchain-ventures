import {select} from "./supabase-rest";
import {isSolanaAddress} from "./policy";

export type SaleRow={
  id:string;mint:string;symbol:string;decimals:number;phase:string;starts_at:string;ends_at:string;claim_starts_at:string;
  price_usd_micros:string;allocation_base_units:string;sold_base_units:string;min_purchase_usd_micros:string;max_purchase_usd_micros:string;
  eligibility_mode:"public"|"allowlist"|"trusted";service_fee_bps:number;vesting_enabled:boolean;vesting_cliff_days:number;vesting_duration_days:number;
  source_vault_token_account:string|null;source_vault_authority:string|null;payment_receiver_wallet:string|null;delivery_mode:"immediate"|"claim";
  launchpad_program_id:string|null;sale_pda:string|null;vault_authority_pda:string|null;program_state_version:number;creator_wallet?:string|null;
};

export async function loadSale(saleId:string){
  if(!/^[0-9a-f-]{36}$/i.test(saleId)) throw new Error("invalid_sale_id");
  const columns="id,mint,symbol,decimals,phase,starts_at,ends_at,claim_starts_at,price_usd_micros,allocation_base_units,sold_base_units,min_purchase_usd_micros,max_purchase_usd_micros,eligibility_mode,service_fee_bps,vesting_enabled,vesting_cliff_days,vesting_duration_days,source_vault_token_account,source_vault_authority,payment_receiver_wallet,delivery_mode,launchpad_program_id,sale_pda,vault_authority_pda,program_state_version,creator_wallet";
  const rows=await select<SaleRow>("launchpad_sales",`id=eq.${encodeURIComponent(saleId)}&select=${columns}&limit=1`);
  const sale=rows[0]; if(!sale) throw new Error("sale_not_found"); return sale;
}

export async function assertEligible(sale:SaleRow,wallet:string){
  if(!isSolanaAddress(wallet)) throw new Error("invalid_wallet");
  if(sale.eligibility_mode==="public") return;
  const rows=await select<{wallet:string}>("launchpad_wallets",`sale_id=eq.${encodeURIComponent(sale.id)}&wallet=eq.${encodeURIComponent(wallet)}&kind=eq.${encodeURIComponent(sale.eligibility_mode)}&select=wallet&limit=1`);
  if(!rows[0]) throw new Error("wallet_not_eligible");
}

export async function confirmedWalletSpend(saleId:string,wallet:string){
  const rows=await select<{usd_micros:string}>("launchpad_purchases",`sale_id=eq.${encodeURIComponent(saleId)}&wallet=eq.${encodeURIComponent(wallet)}&status=eq.confirmed&select=usd_micros`);
  return rows.reduce((sum,row)=>sum+BigInt(row.usd_micros),0n);
}
