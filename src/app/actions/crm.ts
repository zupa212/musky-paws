"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPetRecord(customerId: string, data: { name?: string, breed?: string, weight_kg?: string, type?: string }) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("pets").insert({ customer_id: customerId, ...data });
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/customers");
    return { success: true };
}

export async function updatePetProfile(petId: string, data: { name?: string, breed?: string, weight_kg?: string, birth_date?: string, medical_notes?: string, behavioral_notes?: string }) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("pets").update(data).eq("id", petId);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/customers");
    return { success: true };
}

export async function uploadPetImage(formData: FormData) {
    const petId = formData.get("petId") as string;
    const type = formData.get("type") as "before" | "after" | "general" || "general";
    const file = formData.get("file") as File;
    const notes = formData.get("notes") as string || null;

    if (!petId || !file) return { success: false, error: "Missing data" };

    const supabase = await createAdminClient();

    const ext = file.name.split('.').pop();
    const filePath = `${petId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("pet_gallery").upload(filePath, file);

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: publicUrlData } = supabase.storage.from("pet_gallery").getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("pet_gallery").insert({
        pet_id: petId,
        image_url: publicUrlData.publicUrl,
        type: type,
        notes: notes
    });

    if (dbError) return { success: false, error: dbError.message };

    revalidatePath("/admin/customers");
    return { success: true };
}

export async function deletePetImage(galleryId: string) {
    const supabase = await createAdminClient();

    // 1. Get the image URL to determine the storage path
    const { data: img } = await supabase.from("pet_gallery").select("image_url, pet_id").eq("id", galleryId).single();
    if (!img) return { success: false, error: "Όντως δεν βρέθηκε εικόνα" };

    // Extract the exact path from the URL.
    // Example: https://xxx.supabase.co/storage/v1/object/public/pet_gallery/petId/timestamp.jpg
    const parts = img.image_url.split('/pet_gallery/');
    if (parts.length > 1) {
        const filePath = parts[1];
        await supabase.storage.from('pet_gallery').remove([filePath]);
    }

    // 2. Delete database record
    const { error } = await supabase.from("pet_gallery").delete().eq("id", galleryId);
    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/customers");
    return { success: true };
}
