import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { CodingChallenge } from "../models/CodingChallenge";
import { INITIAL_CODING_CHALLENGES } from "../data/coding-challenges-data";

export async function seedCodingChallenges() {
  console.log("==================================================");
  console.log("  SEEDING PRODUCTION CODING CHALLENGES CATALOG   ");
  console.log("==================================================");

  await connectDB();

  let seededCount = 0;
  for (const chData of INITIAL_CODING_CHALLENGES) {
    let challenge = await CodingChallenge.findOne({ slug: chData.slug });
    if (!challenge) {
      challenge = new CodingChallenge(chData);
      await challenge.save();
    } else {
      Object.assign(challenge, chData);
      await challenge.save();
    }
    seededCount++;
    console.log(`✓ Challenge [${challenge.order}]: "${challenge.title}" (${challenge.slug}) [${challenge.difficulty.toUpperCase()}]`);
  }

  console.log("==================================================");
  console.log(` ✅ SEEDING COMPLETE: ${seededCount} Coding Challenges Ready!`);
  console.log("==================================================");
}

if (require.main === module) {
  seedCodingChallenges()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Challenge seeding error:", err);
      process.exit(1);
    });
}
