import { type MainnetDeploymentEnvName } from "./constants.js";
export type DeploymentEnv = Record<string, string | undefined>;
export interface DeploymentReadiness {
    configured: boolean;
    mainnet: boolean;
    missing: MainnetDeploymentEnvName[];
    invalid: string[];
    rpcCount: number;
    dedicatedRpc: boolean;
    presaleMintConfigured: boolean;
    presaleVaultConfigured: boolean;
    presaleVaultAuthorityConfigured: boolean;
    treasuryConfigured: boolean;
    quoteAuthorityConfigured: boolean;
}
/**
 * Pure configuration validation only. It does not prove that the mint/vault are
 * funded or controlled; live RPC validation remains authoritative for that.
 */
export declare function getDeploymentReadiness(source: DeploymentEnv): DeploymentReadiness;
