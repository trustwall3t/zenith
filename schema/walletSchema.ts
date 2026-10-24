import { z } from 'zod';

export const WalletSchema = z.object({
    id: z.string(),
    BtcAddress: z.string().optional(),
    EthAddress: z.string().optional(),
    UsdtAddress: z.string().optional(),

});
