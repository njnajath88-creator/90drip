import { NextResponse } from "next/server";

let products = [
  {
    id: 1,
    name: 'FC Barcelona #10 Home',
    sport: 'Football',
    price: 1999,
    originalPrice: 2499,
    image: '/images/jersey_product1.png',
    backImage: '/images/jersey_product2.png',
    closeupImage: '/images/jersey_product3.png',
    fitImage: '/images/jersey_product4.png',
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
    backImage: '/images/jersey_product1.png',
    closeupImage: '/images/jersey_product4.png',
    fitImage: '/images/jersey_product3.png',
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
    backImage: '/images/jersey_product4.png',
    closeupImage: '/images/jersey_product1.png',
    fitImage: '/images/jersey_product2.png',
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
    backImage: '/images/jersey_product3.png',
    closeupImage: '/images/jersey_product2.png',
    fitImage: '/images/jersey_product1.png',
    badges: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
];

export async function GET() {
  return Response.json(products);
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
      backImage: body.backImage || null,
      closeupImage: body.closeupImage || null,
      fitImage: body.fitImage || null,
      badges: Array.isArray(body.badges) ? body.badges : (body.badges ? body.badges.split(',').map(b => b.trim()) : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes ? body.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL']),
    };
    products.unshift(newProduct);
    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create product" }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const index = products.findIndex((p) => String(p.id) === String(body.id));
    if (index === -1) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    products[index] = {
      ...products[index],
      ...body,
      id: products[index].id,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      image: body.image || products[index].image,
      backImage: body.backImage !== undefined ? body.backImage : products[index].backImage,
      closeupImage: body.closeupImage !== undefined ? body.closeupImage : products[index].closeupImage,
      fitImage: body.fitImage !== undefined ? body.fitImage : products[index].fitImage,
      badges: Array.isArray(body.badges) ? body.badges : (body.badges ? body.badges.split(',').map(b => b.trim()) : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes ? body.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL']),
    };
    return Response.json(products[index]);
  } catch (error) {
    return Response.json({ error: "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url, "http://localhost:3000");
    const idParam = url.searchParams.get('id');
    let id = idParam ? parseInt(idParam, 10) : null;
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }
    if (id) {
      products = products.filter((p) => p.id !== Number(id));
    }
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return Response.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
