import { PanelService } from "../services/panelService.js";

//ESTO SIRVE PARA CONTROLAR LA INFORMACION A MOSTRAR EN EL PANEL INICIAL DE TANTO DE ADMINISTRACION COMO EL DE BODEGA
export class PanelController {
    constructor(db) {
        this.panelService = new PanelService(db);
    }

    async getInfoPanel(req, res, next) {
        try {
            const infoPanel = await this.panelService.getInfoPanelForAdmin();
            
            res.status(200).json({ success: true, infoPanel });
        } catch (err) {
            next(err);
        }
    }

    async getInfoPanelBodega(req, res, next) {
        try {
            if(!req.logIn) return res.status(401).json({ success: false }); 
            const infoPanel = await this.panelService.getInfoPanelForBodega();
            
            res.status(200).json({ success: true, infoPanel });
        } catch (error) {
            next(error);
        }
    }
}