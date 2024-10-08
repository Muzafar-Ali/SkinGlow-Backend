import { Model } from "mongoose";
import { CheekMakeupCategory } from "../models/categories/cheekMakeup.model";
import { EyesMakeupCategory } from "../models/categories/eyesMakeup.model";
import { LipsMakeupCategory } from "../models/categories/lipsMakeup.model";
import { MakeupProduct } from "../models//products/makeup.model";
import ErrorHandler from "../utils/errorClass";
import { MakeupSchemaType } from "../schema/makeupProduct.schema";
import { FeaturedCategoryMakeup } from "../models/categories/featuredMakeup.model";

export const 
createMakeupProduct = async (
  requestInput: MakeupSchemaType["body"],
  thumbnail: string | undefined,
  images: (string | undefined)[]
) => {
  try {
    const featureCatId = requestInput.categories?.makeup.featuredCategory ?? "" ;
    const cheekCatId = requestInput.categories?.makeup.cheekMakeupCategory ?? "" ;
    const lipsCatId = requestInput.categories?.makeup.lipsMakeupCategory ?? "" ;
    const eyesCatId = requestInput.categories?.makeup.eyesMakeupCategory ?? "" ;

    
    
    // Creates a new makeup product
    if(!featureCatId){
      const product = await MakeupProduct.create({
        ...requestInput,
        thumbnail,
        images
      });
      
      if (!product) throw new Error("Product not created");

      return product;
    }

    // Creates a new makeup product and adds it to the featured category
    if(featureCatId){
      const product = await MakeupProduct.create({
        ...requestInput,
        thumbnail,
        images
      });
      
      if (!product) throw new Error("Product not created");
      
      const result = await FeaturedCategoryMakeup.findByIdAndUpdate(
        featureCatId,
        { $push: { products: product._id } },
        { new: true}
      );
      
      const added = result?.products?.includes(product._id)    
      if(!added) throw new Error("Product not added to featured category");
      
      return product;
    }

    // Creates a new makeup product and adds it to the cheek category
    if(cheekCatId){
      const product = await MakeupProduct.create({
        ...requestInput,
        thumbnail,
        images
      });

      if (!product) throw new Error("Product not created");

      const result = await CheekMakeupCategory.findByIdAndUpdate(
        cheekCatId,
        { $push: { products: product._id } },
        { new: true}
      );

      const added = result?.products?.includes(product._id)
      if(!added) throw new Error("Product not added to cheek category");

      return product;
    }
    // Creates a new makeup product and adds it to the lips category
    if(lipsCatId){
      const product = await MakeupProduct.create({
        ...requestInput,
        thumbnail,
        images
      });

      if (!product) throw new Error("Product not created");

      const result = await LipsMakeupCategory.findByIdAndUpdate(
        lipsCatId,
        { $push: { products: product._id } },
        { new: true}
      );

      const added = result?.products?.includes(product._id)
      if(!added) throw new Error("Product not added to lips category");

      return product;
    }

    // Creates a new makeup product and adds it to the eyes category
    if(eyesCatId){
      const product = await MakeupProduct.create({
        ...requestInput,
        thumbnail,
        images
      });

      if (!product) throw new Error("Product not created");

      const result = await EyesMakeupCategory.findByIdAndUpdate(
        eyesCatId,
        { $push: { products: product._id } },
        { new: true}
      );

      const added = result?.products?.includes(product._id)
      if(!added) throw new Error("Product not added to eyes category");

      return product;
    }

  } catch (error) {
    throw error;
  }
};


export const getCategoryModel = (val: string) => {
  let categoryModel: Model<any>;

  const cat = val.toLowerCase();

  if (cat.startsWith("cheek")) {
    categoryModel = CheekMakeupCategory;
  } else if (cat.startsWith("eyes")) {
    categoryModel = EyesMakeupCategory;
  } else if (cat.startsWith("lips")) {
    categoryModel = LipsMakeupCategory;
  } else {
    throw new ErrorHandler(400, "Invalid category format");
  }

  return categoryModel;
};
