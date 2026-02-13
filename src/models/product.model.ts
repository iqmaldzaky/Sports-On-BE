import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    category: mongoose.Types.ObjectId;
    imageUrl?: string;
    stock: number;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", ProductSchema);