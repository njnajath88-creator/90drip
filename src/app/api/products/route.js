import { NextResponse } from "next/server";

let products = [
  {
    id: 1,
    name: 'FC Barcelona #10 Home',
    sport: 'Football',
    price: 1999,
    originalPrice: 2499,
    image: '/images/jersey_product1.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Classic #7 Red',
    sport: 'Football',
    price: 1499,
    originalPrice: null,
    image: '/images/jersey_product2.png',
    badges: ['Sale'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'City FC #9 Blue',
    sport: 'Football',
    price: 1799,
    originalPrice: 2199,
    image: '/images/jersey_product3.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 4,
    name: 'Green Eagle #11',
    sport: 'Football',
    price: 1299,
    originalPrice: null,
    image: '/images/jersey_product4.png',
    badges: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: Date.now(),
      name: body.name || 'Untitled Jersey',
      sport: body.sport || 'Football',
      price: parseFloat(body.price) || 0,
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      image: body.image || '/images/jersey_product1.png',
      badges: Array.isArray(body.badges) ? body.badges : (body.badges ? body.badges.split(',').map(b => b.trim()) : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes ? body.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL']),
    };
    products.unshift(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const index = products.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products[index] = {
      ...products[index],
      ...body,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      badges: Array.isArray(body.badges) ? body.badges : (body.badges ? body.badges.split(',').map(b => b.trim()) : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes ? body.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL']),
    };
    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : (await request.json()).id;
    products = products.filter((p) => p.id !== Number(id));
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
