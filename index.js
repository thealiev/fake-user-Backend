require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;


app.use(express.json());
app.use(cors());

const nameLookup = {
  USA: [
    "John Smith",
    "Emma Johnson",
    "Michael Williams",
    "Emily Brown",
    "James Jones",
  ],
  France: [
    "Pierre Dupont",
    "Marie Leclerc",
    "Jean Martin",
    "Sophie Dubois",
    "Paul Bernard",
  ],
  Poland: [
    "Jan Kowalski",
    "Anna Nowak",
    "Piotr Wiśniewski",
    "Maria Dąbrowska",
    "Andrzej Lewandowski",
  ],
};

const addressLookup = {
  USA: [
    "123 Main St, Anytown",
    "456 Oak Ave, Cityville",
    "789 Elm St, Townsville",
    "321 Pine St, Villageton",
    "567 Maple Ave, Countryside",
  ],
  France: [
    "1 Rue de la Liberté, Paris",
    "2 Rue des Roses, Lyon",
    "3 Rue de la Paix, Marseille",
    "4 Rue du Commerce, Bordeaux",
    "5 Rue des Écoles, Nice",
  ],
  Poland: [
    "ul. Mickiewicza 1, Warszawa",
    "ul. Piłsudskiego 2, Kraków",
    "ul. Słowackiego 3, Łódź",
    "ul. Nowogrodzka 4, Wrocław",
    "ul. Narutowicza 5, Poznań",
  ],
};

const phoneLookup = {
  USA: [
    "123-456-7890",
    "234-567-8901",
    "345-678-9012",
    "456-789-0123",
    "567-890-1234",
  ],
  France: [
    "01 23 45 67 89",
    "02 34 56 78 90",
    "03 45 67 89 01",
    "04 56 78 90 12",
    "05 67 89 01 23",
  ],
  Poland: [
    "123-456-789",
    "234-567-890",
    "345-678-901",
    "456-789-012",
    "567-890-123",
  ],
};

const generateUserData = (
  region,
  page,
  pageSize,
  errorAmount,
  additionalDataCount
) => {
  if (!nameLookup[region]) {
    throw new Error("Invalid region specified");
  }

  page = Math.max(1, parseInt(page, 10));
  pageSize = Math.max(1, parseInt(pageSize, 10));
  additionalDataCount = Math.max(0, parseInt(additionalDataCount, 10));

  const totalSize = pageSize + additionalDataCount;
  const names = nameLookup[region] || [];
  const addresses = addressLookup[region] || [];
  const phones = phoneLookup[region] || [];

  const userData = Array.from({ length: totalSize }, (_, i) => {
    const index = (page - 1) * pageSize + i + 1;
    const nameIndex = Math.floor(Math.random() * names.length);
    const addressIndex = Math.floor(Math.random() * addresses.length);
    const phoneIndex = Math.floor(Math.random() * phones.length);

    const user = {
      index: index,
      randomIdentifier: Math.random().toString(36).substring(2, 15),
      name: names[nameIndex],
      address: addresses[addressIndex],
      phone: phones[phoneIndex],
    };

    if (i < pageSize && Math.random() < errorAmount / 100) {
      user.name += " (Error)";
    }

    return user;
  });

  return userData;
};

app.post("/api/userData", (req, res) => {
  try {
    const {
      region,
      page,
      pageSize,
      errorAmount,
      additionalDataCount = 0,
    } = req.body;

    console.log("Received parameters:", req.body);

    if (
      !region ||
      typeof page !== "number" ||
      typeof pageSize !== "number" ||
      typeof errorAmount !== "number"
    ) {
      throw new Error("Missing or invalid parameters");
    }

    const userData = generateUserData(
      region,
      page,
      pageSize,
      errorAmount,
      additionalDataCount
    );
    res.json(userData);
  } catch (error) {
    console.error("Error generating user data:", error);
    res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: userData });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
