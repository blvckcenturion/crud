'use client'
import React, { useState } from 'react';
import { Product } from "@/lib/schemas/product";
import { PurchaseItemExtended, PurchaseItemInsertSchema, PurchaseItemUpdateSchema } from "@/lib/schemas/purchase";
import { Button } from "./ui/button";
import { Select, SelectItem, SelectValue, SelectTrigger, SelectLabel, SelectContent, SelectGroup } from "./ui/select";
import { Input } from "./ui/input";
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@radix-ui/react-icons';
import { useToast } from './ui/use-toast';


interface ProductSelectorProps {
    selectedProducts: PurchaseItemExtended[];
    setSelectedProducts: React.Dispatch<React.SetStateAction<PurchaseItemExtended[]>>;
    products: Product[];
    purchaseId?: number; // Optional purchaseId for updates
}

const ProductSelectorComponent: React.FC<ProductSelectorProps> = ({ selectedProducts, setSelectedProducts, products, purchaseId }) => {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [unitaryPrice, setUnitaryPrice] = useState<number>(1);

    const router = useRouter()
    const { toast } = useToast()

    const handleAddProduct = () => {
        if (selectedProductId !== null) {
            const product = products.find(p => p.id === selectedProductId);
            if (product && product.id !== undefined) {

                if (!Number.isInteger(quantity)) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "La cantidad debe ser un número entero.",
                    });
                    return;
                }
                
                
                if (quantity <= 0) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Cantidad debe ser mayor que 0.",
                    });
                    return;
                }
                
                if (unitaryPrice <= 0) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Precio unitario debe ser mayor que 0.",
                    });
                    return;
                }

                let newProduct: PurchaseItemExtended = {
                    product_id: product.id,
                    productName: product.name,
                    qty: quantity,
                    unitary_price: unitaryPrice,
                    isNew: purchaseId === undefined,
                    active: true,
                    purchase_id: purchaseId || 0
                };

                const schema = purchaseId === undefined ? PurchaseItemInsertSchema : PurchaseItemUpdateSchema;
                validateAndSetProduct(newProduct, schema);

                resetInputFields();
            }
        }
    };

    const availableProducts = products.filter(
        (p) => !selectedProducts.some((sp) => sp.product_id === p.id)
    );

    const validateAndSetProduct = (product: PurchaseItemExtended, schema: any) => {
        const result = schema.safeParse(product);
        if (result.success) {
            setSelectedProducts([...selectedProducts, result.data]);
        } else {
            console.error("Validation error:", result.error);
        }
    };

    const resetInputFields = () => {
        setSelectedProductId(null);
        setQuantity(1);
        setUnitaryPrice(0);
    };

    const handleDeleteProduct = (productId: number) => {
        // Filter out the product to be deleted
        const updatedProducts = selectedProducts.filter((p) => p.product_id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handleProductChange = (productId: number, field: 'qty' | 'unitary_price', value: number) => {
        if (field === 'qty' && value <= 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Cantidad debe ser mayor que 0.",
            });
            return;
        }
        
        if (field === 'qty' && !Number.isInteger(value)) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "La cantidad debe ser un número entero.",
            });
            return;
        }
        
        if (field === 'unitary_price' && value <= 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Precio unitario debe ser mayor que 0.",
            });
            return;
        }
    
        const updatedProducts = selectedProducts.map(p =>
            p.product_id === productId ? { ...p, [field]: value, isModified: true } : p
        );
        setSelectedProducts(updatedProducts);
    };

    const handleProductSelect = (value: string) => {
        if (value === "-1") {
            router.push('/dashboard/product')
        } else {
            setSelectedProductId(Number(value))
        }
    }

    return (
        <div className="p-4 border rounded-md">
          {/* Section 1: Add products to purchase */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Agregar productos a compra</h3>
            <label className="block">
                <span className="block text-sm font-medium text-gray-700">Producto</span>
                <Select onValueChange={handleProductSelect} value={selectedProductId?.toString() || ''}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Productos Existentes</SelectLabel>
                            {availableProducts.map(product => product.id !== undefined && (
                                <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Mas Opciones</SelectLabel>
                            <SelectItem value="-1">
                                Agregar Mas Productos
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>    
            </label>
                
            <label className="block mt-2">
                <span className="block text-sm font-medium text-gray-700">Cantidad</span>
                    <Input
                        type="number"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1" />
            </label>
            <label className="block mt-2">
                <span className="block text-sm font-medium text-gray-700">Precio Unitario</span>
                <Input
                    type="number"
                    step="0.01" // Allows for floating point numbers
                    value={unitaryPrice}
                    onChange={(e) => setUnitaryPrice(parseFloat(e.target.value))}
                    className="mt-1"
                />
            </label>
            <Button type="button" onClick={handleAddProduct} className="mt-2">Agregar</Button>
          </div>
    
          {/* Section 2: Added products list */}
          {selectedProducts.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold mb-2">Productos agregados</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="space-y-2">
                        {selectedProducts.map((product) => (
                        <div key={product.product_id} className="border p-2 rounded-md mx-2">
                            <div className="flex justify-between items-center mb-2">
                            <h4 className="text-md font-medium">{product.productName}</h4>
                            <Button onClick={() => handleDeleteProduct(product.product_id)}>
                                <TrashIcon className="h-5 w-5 text-red-500" />
                            </Button>
                            </div>
                            <div className="flex space-x-2">
                            <label className="flex-1" htmlFor={`quantity-${product.product_id}`}>
                                <span className="block text-sm font-medium text-gray-700">Cantidad</span>
                                <Input step="1" id={`quantity-${product.product_id}`} type="number" value={product.qty} onChange={(e) => handleProductChange(product.product_id, 'qty', Number(e.target.value))} className="mt-1" />
                            </label>
                            <label className="flex-1" htmlFor={`price-${product.product_id}`}>
                                <span className="block text-sm font-medium text-gray-700">Precio Unitario</span>
                                <Input id={`price-${product.product_id}`} type="number" step="0.01" value={product.unitary_price} onChange={(e) => handleProductChange(product.product_id, 'unitary_price', parseFloat(e.target.value))} className="mt-1" />
                            </label>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSelectorComponent;