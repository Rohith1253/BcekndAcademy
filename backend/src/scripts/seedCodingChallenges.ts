try {
  require("dotenv").config();
} catch {}
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { CodingChallenge } from "../models/CodingChallenge";
import { INITIAL_CODING_CHALLENGES } from "../data/coding-challenges-data";

export async function seedCodingChallenges() {
  console.log("==================================================");
  console.log("   SEEDING CODING CHALLENGES INTO MONGODB         ");
  console.log("==================================================");

  await connectDB();

  let createdCount = 0;
  let updatedCount = 0;

  for (const challenge of INITIAL_CODING_CHALLENGES) {
    const existing = await CodingChallenge.findOne({ slug: challenge.slug });
    if (!existing) {
      await CodingChallenge.create(challenge);
      createdCount++;
      console.log(`  + Created challenge: [${challenge.category}] "${challenge.title}" (${challenge.slug})`);
    } else {
      await CodingChallenge.findOneAndUpdate(
        { slug: challenge.slug },
        { $set: challenge },
        { new: true }
      );
      updatedCount++;
      console.log(`  ✓ Updated challenge: [${challenge.category}] "${challenge.title}" (${challenge.slug})`);
    }
  }

  const totalInDb = await CodingChallenge.countDocuments();
  console.log("==================================================");
  console.log(` ✅ SEEDING COMPLETE!`);
  console.log(`    • Created: ${createdCount}`);
  console.log(`    • Updated: ${updatedCount}`);
  console.log(`    • Total in Database: ${totalInDb}`);
  console.log("==================================================");
}

// If invoked directly from CLI
if (require.main === module) {
  seedCodingChallenges()
    .then(() => {
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      mongoose.disconnect();
      process.exit(1);
    });
}
