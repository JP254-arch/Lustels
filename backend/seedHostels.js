const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Hostel = require("./models/Hostel");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

const hostels = [
  {
    name: "Green View Hostel",
    location: "Nairobi",
    address: "123 Nairobi Street",
    description:
      "Spacious rooms, WiFi, security, and meals included. Quiet environment ideal for students.",
    price: 12000,
    roomType: "single",
    totalRooms: 10,
    bedsPerRoom: 2,
    amenities: ["WiFi", "Water", "Security", "Meals"],
    status: "active",
    genderPolicy: "male",
    assignedWarden: "Warden A",
    imageUrl:
      "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=1200&auto=format&fit=crop&q=60",
  },
  {
    name: "Sunrise Hostel",
    location: "Kisumu",
    address: "456 Kisumu Road",
    description:
      "Affordable shared rooms with 24/7 water and electricity. Friendly management.",
    price: 10000,
    roomType: "shared",
    totalRooms: 8,
    bedsPerRoom: 4,
    amenities: ["Water", "Electricity", "Meals"],
    status: "active",
    genderPolicy: "female",
    assignedWarden: "Warden B",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=1200&auto=format&fit=crop&q=60",
  },
];

const seedDB = async () => {
  await Hostel.deleteMany({});
  await Hostel.insertMany(hostels);
  console.log("✅ Hostels seeded");
  mongoose.connection.close();
};

seedDB();
