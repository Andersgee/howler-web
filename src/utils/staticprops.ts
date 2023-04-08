import { prisma } from "src/server/db";

export type Event = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

export async function getEvent(id: number) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}
