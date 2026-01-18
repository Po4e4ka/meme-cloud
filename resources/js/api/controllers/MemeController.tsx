import { AbstractController } from "@/api/controllers/AbstractController";
import { router } from "@inertiajs/react";

export class MemeController extends AbstractController {
    public async delete(cardId: number) {
        return router.delete(route('meme.delete', cardId), {
            onSuccess: () => {
                router.visit(route('dashboard'));
            }
        });
    }

    public async new(formData: FormData) {
        return router.post(route('meme.upload'), formData, {
            forceFormData: true, // важно!
            onSuccess: () => {
                router.visit(route('dashboard'));
            }
        })
    }

    public async update(cardId: number, formData: FormData) {
        return router.post(route('meme.update', cardId), formData, {
            forceFormData: true,
            onSuccess: () => {
                router.visit(route('dashboard'));
            }
        })
    }
}
