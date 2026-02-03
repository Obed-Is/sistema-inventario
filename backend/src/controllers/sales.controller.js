import { SalesService } from "../services/salesService.js";
import { TokenService } from "../services/tokenService.js";

export class SalesController {
    constructor(poolDatabase) {
        this.salesService = new SalesService(poolDatabase);
        this.tokenService = new TokenService(poolDatabase);
    }

    async createNewSale(req, res, next) {
        try {
            if (!req.logIn) return res.status(401).json({ success: false });

            const { venta } = req.body;
            const userPayload = await this.tokenService.getPayloadToken(req.cookies.acess_token);

            const sale = await this.salesService.createNewSale(venta, userPayload.id);
            if (!sale) return res.status(400).json({ success: false });

            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}
