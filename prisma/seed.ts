import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import type { Prisma } from "../src/generated/prisma/index.js";

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({
    url: "file:./dev.db",
  });
  return new PrismaClient({ adapter });
};

const prisma = prismaClientSingleton();

const generatePosts = (count: number): Prisma.PostCreateInput[] => {
  return Array.from({ length: count }, (_, i) => ({
    title: `Post ${i + 1}: Sample Title`,
    slug: `post-${i + 1}-sample-title`,
    content: `This is the content for post number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    published: true,
    author: {
      connectOrCreate: {
        where: {
          email: "john@example.com",
        },
        create: {
          password: "password123",
          email: "john@example.com",
          name: "John Doe",
        },
      },
    },
  }));
};

async function main() {
  const posts = generatePosts(100);
  console.log(`Seeding database with ${posts.length} posts...`);
  
  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });
    console.log(`Created post with id: ${post.id}`);
  }
  console.log("Database seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
