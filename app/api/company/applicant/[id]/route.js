import connectDB from "@/lib/mongoose";
import User from "@/models/User";
// import Application from "@/models/Application";/

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const user = await User.findById(id).select("-password");
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const applications = await Application.find({ user: id }).populate("job", "title company");
    return new Response(JSON.stringify({ user, applications }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();

    const application = await Application.findById(id);
    if (!application) return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });

    application.status = status;
    await application.save();

    return new Response(JSON.stringify({ message: "Status updated" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}
