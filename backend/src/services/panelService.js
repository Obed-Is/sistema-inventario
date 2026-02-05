import { PanelModel } from "../models/panel.model.js";

export class PanelService {
    constructor(db) {
        this.panelModel = new PanelModel(db);
    }
    
    async getInfoPanelForAdmin() {
        const [resultSetAdmin] = await this.panelModel.getInfoPanelForAdmin();
        const infoAdmin = this.#formatInfoAdmin(resultSetAdmin);
        
        return infoAdmin;
    }

    async getInfoPanelForBodega() {
        const [resultSetBodega] = await this.panelModel.getInfoPanelForBodega();
        const infoBodega = this.#formatInfoBodega(resultSetBodega);
        return infoBodega;
    }

    #formatInfoAdmin(resultados) {
        return {
            stock_bajo : resultados[0],
            general_producto : resultados[1][0],
            mas_vendidos : resultados[2],
            categorias_totales : resultados[3][0].categorias_totales,
            usuarios_totales : resultados[4][0].usuarios_totales,
            reporte_semana : resultados[5][0],
            reporte_mes : resultados[6][0]
        }
    }

    #formatInfoBodega(resultados) {
        return {
            stock_bajo : resultados[0],
            cantidad_productos : resultados[1][0].cantidad_productos,
            mas_vendidos : resultados[2],
            categorias_totales : resultados[3][0].categorias_totales
        }
    }
}