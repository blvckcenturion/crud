import { z } from 'zod';

export const ClassEnum = z.enum(['porcelain', 'ceramic', 'semigress']);
export const FormatEnum = z.enum([
  '24x40cm', '30x45cm', '30x60cm', '15X60cm', '15X90cm', 
  '46x46cm', '51x51cm', '60x60cm', '61x61cm', '60x120cm', 'other'
]);
export const TypeEnum = z.enum(['vitrified', 'satin', 'polished', 'rustic']);

export const ProductSchema = z.object({
    id: z.number().optional(),
    active: z.boolean().default(true),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    name: z.string().min(1, "El nombre es obligatorio."),
    description: z.string().optional(),
    alias: z.string().nullable().optional(),
    class: ClassEnum.optional().refine(val => val !== undefined, {
      message: "La clase es obligatoria."
    }),
    format: FormatEnum.optional().refine(val => val !== undefined, {
      message: "El formato es obligatorio."
    }),
    type: TypeEnum.optional().refine(val => val !== undefined, {
      message: "El tipo es obligatorio."
    }),
  provider_id: z.number().nullable().optional(),
  image_url: z.string().nullable().optional(),
});

export const ProductWithProviderSchema = ProductSchema.extend({
  provider: z.object({
    name: z.string().optional(),
    id: z.number().optional()
  }).optional().nullable()
})

// Mapping from Spanish labels to enum numbers
export const classMapping: Record<string, string> = {
    "porcelana": "porcelain",
    "cerámica": "ceramic",
    "semigress": "semigress"
  };
  
  export const formatMapping: Record<string, string> = {
    "24x40cm": "24x40cm",
    "30x45cm": "30x45cm",
    "30x60cm": "30x60cm",
    "15X60cm": "15X60cm",
    "15X90cm": "15X90cm",
    "46x46cm": "46x46cm",
    "51x51cm": "51x51cm",
    "60x60cm": "60x60cm",
    "61x61cm": "61x61cm",
    "60x120cm": "60x120cm",
    "otro": "other"
  };
  
  export const typeMapping: Record<string, string> = {
    "vitrificado": "vitrified",
    "satinado": "satin",
    "pulido": "polished",
    "rústico": "rustic"
  };

// Define mapping objects for numerical equivalents
export const classNumericalMapping: Record<string, number> = {
    "porcelain": 1,
    "ceramic": 2,
    "semigress": 3
};
  
export const formatNumericalMapping: Record<string, number> = {
    '24x40cm': 1,
    '30x45cm': 2,
    '30x60cm': 3,
    '15X60cm': 4,
    '15X90cm': 5,
    '46x46cm': 6,
    '51x51cm': 7,
    '60x60cm': 8,
    '61x61cm': 9,
    '60x120cm': 10,
    'other': 11
};
  
export const typeNumericalMapping: Record<string, number> = {
    "vitrified": 1,
    "satin": 2,
    "polished": 3,
    "rustic": 4
};

export type Product = z.infer<typeof ProductSchema>;
export type ProductWithProvider = z.infer<typeof ProductWithProviderSchema>