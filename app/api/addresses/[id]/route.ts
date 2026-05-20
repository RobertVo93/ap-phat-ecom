import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { deleteAddress, updateAddress } from "@/lib/services/addressService";

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await ensureDataSource();
//     const data = await req.json();

//     const updated = await updateAddress(params.id, data.data)
//     if (!updated) return NextResponse.json({ error: "Cannot update address" }, { status: 400 });
//     return NextResponse.json(updated);
//   } catch (error) {
//     return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await ensureDataSource();
//     const { id } = await params;
//     const result = await deleteAddress(id);
//     if (!result) return NextResponse.json({ error: "Cannot delete address" }, { status: 400 });
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
//   }
// } 