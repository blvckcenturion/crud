import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number().optional(),
    active: z.boolean().default(true),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    description: z.string()
        .min(1, "La descripción es obligatoria.")
        .refine(value => value.trim() !== '', { message: "La descripción es obligatoria." }), // Custom required message

    max_unit_description: z.string()
        .min(1, "La descripción de la unidad máxima es obligatoria.")
        .refine(value => value.trim() !== '', { message: "La descripción de la unidad máxima es obligatoria." }), // Custom required message

    measure_unit_description: z.string()
        .min(1, "La descripción de la unidad de medida es obligatoria.")
        .refine(value => value.trim() !== '', { message: "La descripción de la unidad de medida es obligatoria." }), // Custom required message

    provider_id: z.number().nullable().optional(),
    unit: z.string()
        .min(1, "La unidad es obligatoria.")
        .refine(value => value.trim() !== '', { message: "La unidad es obligatoria." }), // Custom required message

    unit_x_max_unit: z.number()
        .positive("El valor debe ser un número positivo.")
        .max(10000, "El valor es demasiado grande."),

    unit_x_measure_unit: z.number()
        .positive("El valor debe ser un número positivo.")
        .max(10000, "El valor es demasiado grande."),
});

export type Product = z.infer<typeof ProductSchema>