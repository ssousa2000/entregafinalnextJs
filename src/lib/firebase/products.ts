import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  limit as limitQuery,
  DocumentData,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { Product, Category } from '@/types';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const PRODUCT_IMAGES_PATH = 'product-images';

// Get all products
export async function getAllProducts() {
  try {
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    
    if (!productDoc.exists()) {
      return null;
    }
    
    return { id: productDoc.id, ...productDoc.data() } as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category: string) {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    
    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return products;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
}

// Get featured products
export async function getFeaturedProducts(limitCount?: number) {
  try {
    const featuredQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where('featured', '==', true)
    );
    
    const queryWithLimit = limitCount 
      ? query(featuredQuery, limitQuery(limitCount))
      : featuredQuery;
    
    const productsSnapshot = await getDocs(queryWithLimit);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Add a new product
export async function addProduct(product: Omit<Product, 'id'>, imageFile?: File) {
  try {
    let imageUrl = product.imageUrl;
    
    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `${PRODUCT_IMAGES_PATH}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }
    
    // Add product document to Firestore
    const productData = {
      ...product,
      imageUrl,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return { id: docRef.id, ...productData } as Product;
    
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Update a product
export async function updateProduct(id: string, product: Partial<Product>, imageFile?: File) {
  try {
    let updatedData = { ...product } as any; // Using any to avoid strict typing for updatedAt
    
    // Upload new image if provided
    if (imageFile) {
      // Delete old image if it exists
      if (product.imageUrl) {
        try {
          const oldImageRef = ref(storage, product.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          // Ignore error if image doesn't exist
          console.log('Failed to delete old image, might not exist:', error);
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `${PRODUCT_IMAGES_PATH}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      updatedData.imageUrl = await getDownloadURL(uploadResult.ref);
    }
    
    // Update product document in Firestore
    updatedData.updatedAt = Timestamp.now();
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), updatedData);
    
    return { id, ...product, ...updatedData } as Product;
    
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    // Get product first to get image URL
    const product = await getProductById(id);
    
    if (product && product.imageUrl) {
      // Delete image from storage
      try {
        const imageRef = ref(storage, product.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        // Ignore error if image doesn't exist
        console.log('Failed to delete product image, might not exist:', error);
      }
    }
    
    // Delete product document from Firestore
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return true;
    
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesCol = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCol);
    
    if (categoriesSnapshot.empty) {
      console.log('No categories found.');
      return [];
    }
    
    const categories: Category[] = categoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
      } as Category;
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw new Error('Could not fetch categories.');
  }
};

// Paginated products query
export async function getPaginatedProducts(
  pageSize = 10, 
  lastVisible?: QueryDocumentSnapshot<DocumentData>
) {
  try {
    let q;
    
    if (lastVisible) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limitQuery(pageSize)
      );
    } else {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limitQuery(pageSize)
      );
    }
    
    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Get last document for next pagination query
    const lastVisibleDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];
    
    return {
      products,
      lastVisible: lastVisibleDoc
    };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    throw error;
  }
} 