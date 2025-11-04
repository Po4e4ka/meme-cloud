import { getApiBaseUrl } from "@/api/config";
import { ROUTE } from "@/api/routes";
import { VERSION } from "@/api/versions";
import {MemeController} from "@/api/controllers/MemeController";


export class InternalApi {
    private readonly baseUrl: string;
    private version = null;

    constructor() {
        this.baseUrl = getApiBaseUrl();
    }
    
    public v1(): InternalApi {
        this.version = VERSION.V1;
        return this;
    }
    
    public meme(): MemeController {
        return new MemeController(this.getBasePath());
    }
    
    private getBasePath() {
        if (!this.version) {
            throw new Error('Runtime Exception: version must me set');
        }
        return this.baseUrl + this.version;
    }
}
