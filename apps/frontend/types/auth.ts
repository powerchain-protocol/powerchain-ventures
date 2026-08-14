export type AuthUser = {id:string;email:string|null;displayName:string|null;createdAt:string|null;emailConfirmedAt:string|null};
export type AuthState = {configured:boolean;loading:boolean;authenticated:boolean;user:AuthUser|null};
export type AuthResult = {ok:boolean;message?:string;emailConfirmationRequired?:boolean};
