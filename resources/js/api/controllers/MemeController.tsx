import { AbstractController } from "@/api/controllers/AbstractController";
import { router } from "@inertiajs/react";

export class MemeController extends AbstractController {
    public async delete(cardId: number) {
        return router.delete(route('media.delete', cardId));
    }
}
