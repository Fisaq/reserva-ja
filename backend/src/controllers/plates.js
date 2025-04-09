import PlatesDataAccess from "../dataAccess/plates.js";
import {ok, serverError} from '../helpers/httpResponse.js';

export default class PlatesControllers{
    constructor(){
        this.dataAccess = new PlatesDataAccess();
    }

    //Controller para criacao de prato
    async getPlates() {
        try{
            const plates = await this.dataAccess.getPlates();

            console.log(plates);

            return ok(plates);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para pratos disponiveis
    async getAvailablePlates() {
        try{
            const availablePlates = await this.dataAccess.getAvailablePlates();

            console.log(availablePlates);

            return ok(availablePlates);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a insercao de um prato
    async addPlate(plateData) {
        try{
            const result = await this.dataAccess.addPlate(plateData);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a exclusao de um prato
    async deletePlate(plateId) {
        try{
            const result = await this.dataAccess.deletePlate(plateId);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };

    //Controller para a atualizacao de prato
    async updatePlate(plateId, plateData) {
        try{
            const result = await this.dataAccess.updatePlate(plateId, plateData);

            return ok(result);
        }catch (error){
            return serverError(error);
        }
    };
}