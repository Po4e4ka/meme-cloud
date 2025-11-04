import { AbstractController } from "@/api/controllers/AbstractController";
import { ROUTE } from "@/api/routes";

export class MemeController extends AbstractController {
    public async delete(cardId: number) {
        const path = this.replaceUrlPathVariables(ROUTE.MEME_CARD_DELETE, { id: cardId });
        const response = await this.request(this.basePath + path);
        return response.json();
    }
}
