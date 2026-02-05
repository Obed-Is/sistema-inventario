export class PanelModel {
    constructor(db) {
        this.db = db;
    }
    
    async getInfoPanelForAdmin() {
        // esto es un stored procedure guardado en la base de datos para obtener un resumen
        // ya que contiene multiples consultas por eso es llamado asi
        return this.db.query('CALL resumenPanelInventarioAdmin()');
    }

    async getInfoPanelForBodega() {
        return this.db.query('CALL resumenPanelInventarioBodega()');
    }
}