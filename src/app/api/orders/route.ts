import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, doc, updateDoc, getDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { CartItem } from '@/types';

// POST /api/orders
// Creates a new order and updates product stock
export async function POST(request: NextRequest) {
  try {
    const { userId, items, totalAmount, shippingAddress } = await request.json();

    // Basic validation
    if (!userId || !items || !items.length || !totalAmount || !shippingAddress) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Use a batch write to ensure all stock updates happen or none do
    const batch = writeBatch(db);

    // 1. Update the stock for each product in the order
    for (const item of items as CartItem[]) {
      const productRef = doc(db, 'products', item.product.id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0;
        const newStock = currentStock - item.quantity;

        if (newStock < 0) {
          // If any product is out of stock, abort the entire transaction
          throw new Error(`Not enough stock for product: ${item.product.name}`);
        }

        batch.update(productRef, { stock: newStock });
      } else {
        throw new Error(`Product with ID ${item.product.id} not found.`);
      }
    }

    // 2. Create the new order document
    const ordersRef = collection(db, 'orders');
    const newOrderRef = doc(ordersRef); // Create a new doc reference with a generated ID
    batch.set(newOrderRef, {
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    // 3. Commit the batch write
    await batch.commit();

    return NextResponse.json({ success: true, orderId: newOrderRef.id });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 